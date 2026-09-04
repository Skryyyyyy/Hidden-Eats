from fastapi import FastAPI, HTTPException, BackgroundTasks, Security, Depends, status
from fastapi.security import APIKeyHeader, HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, field_validator
import logging
import os
import re
import secrets
from urllib.parse import urlparse
from typing import List, Optional

from modules.ingest import download_video
from modules.audio_processor import transcribe_audio
from modules.vision_processor import extract_text_from_frames
from modules.extractor import extract_restaurant_info
from modules.scraper import scrape_youtube_urls

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hidden Eats Extraction Pipeline")

# Security API Key Setup
ML_API_KEY = os.getenv("ML_API_KEY", "he_ml_secret_key_2026")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
bearer_scheme = HTTPBearer(auto_error=False)

def verify_api_key(
    api_key: Optional[str] = Security(api_key_header),
    bearer_token: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme)
):
    """
    Constant-time comparison for ML Pipeline API key validation.
    Supports either 'X-API-Key' header or 'Authorization: Bearer <key>'
    """
    token = api_key or (bearer_token.credentials if bearer_token else None)
    
    if not token or not secrets.compare_digest(token, ML_API_KEY):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing ML Pipeline API Key. Unauthorized."
        )
    return True

# SSRF Defense: Domain & Hostname Validation
ALLOWED_DOMAINS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "instagram.com",
    "www.instagram.com",
}

BLOCKED_IP_PATTERNS = [
    r"^127\.",
    r"^10\.",
    r"^172\.(1[6-9]|2[0-9]|3[0-1])\.",
    r"^192\.168\.",
    r"^169\.254\.",
    r"^0\.0\.0\.0",
    r"^localhost$",
    r"^\[?::1\]?$",
]

def validate_safe_media_url(url: str) -> str:
    """
    Validates that a URL is well-formed, uses http/https, targets allowed domains,
    and prevents Server-Side Request Forgery (SSRF) against internal services.
    """
    if not url or not isinstance(url, str):
        raise HTTPException(status_code=400, detail="Invalid URL format.")
    
    try:
        parsed = urlparse(url.strip())
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed URL.")
    
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(status_code=400, detail="Disallowed protocol. Only http/https supported.")
    
    hostname = (parsed.hostname or "").lower()
    if not hostname:
        raise HTTPException(status_code=400, detail="Missing hostname in URL.")
    
    # Check for prohibited credentials in URL
    if parsed.username or parsed.password:
        raise HTTPException(status_code=400, detail="User credentials in URL are prohibited.")
    
    # Block internal IP ranges & localhost
    for pattern in BLOCKED_IP_PATTERNS:
        if re.search(pattern, hostname):
            raise HTTPException(status_code=403, detail="SSRF Protection: Access to private IP or internal host is prohibited.")
    
    # Enforce allowed media domain whitelist
    if hostname not in ALLOWED_DOMAINS and not any(hostname.endswith("." + d) for d in ALLOWED_DOMAINS):
        raise HTTPException(status_code=400, detail="Disallowed domain. Only YouTube and Instagram URLs are permitted.")
    
    return url

class VideoRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def check_url(cls, v: str) -> str:
        return validate_safe_media_url(v)

class ScrapeRequest(BaseModel):
    query_or_url: str
    max_results: int = 5

    @field_validator("max_results")
    @classmethod
    def check_max(cls, v: int) -> int:
        if v < 1 or v > 20:
            raise ValueError("max_results must be between 1 and 20")
        return v

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
        
        # Step 5: Save to DB (Supabase/DB integration)
        logger.info(f"Extracted JSON for {url}: {result}")
        logger.info(f"Pipeline completed successfully for {url}")
    except Exception as e:
        logger.error(f"Pipeline failed for {url}: {str(e)}")

async def batch_process(urls: List[str]):
    """Processes a list of URLs sequentially to avoid crashing the GPU."""
    logger.info(f"Starting batch processing of {len(urls)} videos...")
    for index, url in enumerate(urls):
        try:
            safe_url = validate_safe_media_url(url)
            logger.info(f"--- Processing video {index + 1} of {len(urls)} ---")
            await process_pipeline(safe_url)
        except Exception as err:
            logger.warning(f"Skipping unsafe or invalid URL {url}: {err}")
    logger.info("Batch processing complete.")

@app.post("/process-video", dependencies=[Depends(verify_api_key)])
async def process_video(request: VideoRequest, background_tasks: BackgroundTasks):
    safe_url = validate_safe_media_url(request.url)
    background_tasks.add_task(process_pipeline, safe_url)
    
    return {
        "message": "Video processing started in the background.",
        "url": safe_url,
        "status": "processing"
    }

@app.post("/scrape-and-process", dependencies=[Depends(verify_api_key)])
async def scrape_and_process(request: ScrapeRequest, background_tasks: BackgroundTasks):
    try:
        urls = scrape_youtube_urls(request.query_or_url, request.max_results)
        if not urls:
            return {"message": "No URLs found for the given query.", "status": "failed"}
            
        background_tasks.add_task(batch_process, urls)
        
        return {
            "message": f"Successfully scraped {len(urls)} videos. Batch processing started in the background.",
            "scraped_urls": urls,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
