from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import logging
from typing import List

from modules.ingest import download_video
from modules.audio_processor import transcribe_audio
from modules.vision_processor import extract_text_from_frames
from modules.extractor import extract_restaurant_info
from modules.scraper import scrape_youtube_urls

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hidden Eats Extraction Pipeline")

class VideoRequest(BaseModel):
    url: str

class ScrapeRequest(BaseModel):
    query_or_url: str
    max_results: int = 5

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "ml-pipeline"}

async def process_pipeline(url: str):
    logger.info(f"Starting pipeline for URL: {url}")
    try:
        # Step 1: Ingest (Download audio & frames)
        frames_dir, audio_path = download_video(url)
        
        # Step 2: Transcribe Audio (Faster-Whisper)
        transcript = transcribe_audio(audio_path)
        
        # Step 3: OCR (EasyOCR)
        frame_text = extract_text_from_frames(frames_dir)
        
        # Step 4: LLM Extraction (Ollama/Phi-3)
        result = extract_restaurant_info(transcript, frame_text)
        
        # Step 5: Save to DB (Supabase/DB integration to be added later)
        # save_to_db(result)
        logger.info(f"Extracted JSON for {url}: {result}")
        
        logger.info(f"Pipeline completed successfully for {url}")
    except Exception as e:
        logger.error(f"Pipeline failed for {url}: {str(e)}")

async def batch_process(urls: List[str]):
    """Processes a list of URLs sequentially to avoid crashing the GPU."""
    logger.info(f"Starting batch processing of {len(urls)} videos...")
    for index, url in enumerate(urls):
        logger.info(f"--- Processing video {index + 1} of {len(urls)} ---")
        await process_pipeline(url)
    logger.info("Batch processing complete.")

@app.post("/process-video")
async def process_video(request: VideoRequest, background_tasks: BackgroundTasks):
    if "youtube.com" not in request.url and "youtu.be" not in request.url:
        raise HTTPException(status_code=400, detail="Only YouTube URLs are supported currently.")
    
    # Run the heavy pipeline in the background so we don't block the API
    background_tasks.add_task(process_pipeline, request.url)
    
    return {
        "message": "Video processing started in the background.",
        "url": request.url,
        "status": "processing"
    }

@app.post("/scrape-and-process")
async def scrape_and_process(request: ScrapeRequest, background_tasks: BackgroundTasks):
    try:
        urls = scrape_youtube_urls(request.query_or_url, request.max_results)
        if not urls:
            return {"message": "No URLs found for the given query.", "status": "failed"}
            
        # Queue the batch processor in the background
        background_tasks.add_task(batch_process, urls)
        
        return {
            "message": f"Successfully scraped {len(urls)} videos. Batch processing started in the background.",
            "scraped_urls": urls,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

