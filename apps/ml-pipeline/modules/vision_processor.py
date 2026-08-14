import os
import glob
import logging
import easyocr

logger = logging.getLogger(__name__)

def extract_text_from_frames(frames_dir: str) -> str:
    """
    Reads all extracted frames from a directory using EasyOCR and returns the combined text.
    """
    logger.info("Initializing EasyOCR into VRAM...")
    
    # gpu=True will use the RTX 4060.
    try:
        reader = easyocr.Reader(['en'], gpu=True)
    except Exception as e:
        logger.warning(f"Failed to load EasyOCR on GPU, falling back to CPU. Error: {e}")
        reader = easyocr.Reader(['en'], gpu=False)

    frame_files = sorted(glob.glob(os.path.join(frames_dir, "*.jpg")))
    logger.info(f"Found {len(frame_files)} frames to process.")
    
    extracted_texts = []
    
    for frame_path in frame_files:
        logger.debug(f"Processing {frame_path}...")
        # readtext returns a list of tuples: (bbox, text, prob)
        result = reader.readtext(frame_path)
        
        # Only keep text with a reasonable confidence (e.g., > 0.5)
        # and filter out extremely short noise strings
        frame_strings = []
        for (bbox, text, prob) in result:
            if prob > 0.4 and len(text.strip()) > 2:
                frame_strings.append(text)
                
        if frame_strings:
            extracted_texts.append(f"--- Frame: {os.path.basename(frame_path)} ---")
            extracted_texts.append(" ".join(frame_strings))
            
    # Combine into a single text block
    full_ocr_text = "\n".join(extracted_texts)
    
    # Explicitly delete the reader to free VRAM for the final LLM step
    del reader
    logger.info("OCR complete. Freed VRAM.")
    
    return full_ocr_text

if __name__ == "__main__":
    pass
