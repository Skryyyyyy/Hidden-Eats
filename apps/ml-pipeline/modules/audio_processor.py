import logging
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

# Note: Model loading is done inside the function to allow memory to be freed
# if this script is called as a separate process, or we can explicitly delete it.

def transcribe_audio(audio_path: str, model_size: str = "base") -> str:
    """
    Transcribes the audio file using Faster-Whisper.
    Uses 'base' or 'small' to fit easily within 8GB VRAM alongside other processes.
    """
    logger.info(f"Loading faster-whisper model ({model_size}) into VRAM...")
    
    # device="cuda" will use the RTX 4060. compute_type="float16" saves memory.
    # If testing on a machine without GPU, change device to "cpu" and compute_type to "int8"
    try:
        model = WhisperModel(model_size, device="cuda", compute_type="float16")
    except Exception as e:
        logger.warning(f"Failed to load on CUDA, falling back to CPU. Error: {e}")
        model = WhisperModel(model_size, device="cpu", compute_type="int8")

    logger.info("Transcribing audio...")
    segments, info = model.transcribe(audio_path, beam_size=5)

    logger.info("Detected language '%s' with probability %f" % (info.language, info.language_probability))

    full_transcript = []
    for segment in segments:
        full_transcript.append(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")

    # Combine into a single text block
    result = "\n".join(full_transcript)
    
    # Explicitly delete the model to free VRAM for the next steps (OCR/LLM)
    del model
    logger.info("Transcription complete. Freed VRAM.")
    
    return result

if __name__ == "__main__":
    # Test execution
    pass
