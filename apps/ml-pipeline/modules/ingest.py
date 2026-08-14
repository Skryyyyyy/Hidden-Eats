import os
import yt_dlp
import ffmpeg
import tempfile
import logging

logger = logging.getLogger(__name__)

def download_video(url: str):
    """
    Downloads the lowest resolution video and the best audio from a YouTube URL.
    Returns the path to the extracted audio file and the directory containing extracted frames.
    """
    # Create a unique temporary directory for this download
    temp_dir = tempfile.mkdtemp(prefix="hidden_eats_")
    video_path_template = os.path.join(temp_dir, "video.%(ext)s")
    audio_path = os.path.join(temp_dir, "audio.wav")
    frames_dir = os.path.join(temp_dir, "frames")
    os.makedirs(frames_dir, exist_ok=True)

    # yt-dlp options: download lowest res video (for frames) + best audio
    ydl_opts = {
        'format': 'worstvideo[ext=mp4]+bestaudio[ext=m4a]/worst[ext=mp4]/worst',
        'outtmpl': video_path_template,
        'quiet': False,
        'no_warnings': True,
        'merge_output_format': 'mp4'
    }

    logger.info(f"Downloading video from {url} to {temp_dir}...")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            # Find the actual downloaded file path
            downloaded_video_path = ydl.prepare_filename(info_dict)
            if not downloaded_video_path.endswith('.mp4'):
                # Handle cases where merge doesn't happen or ext differs
                base, _ = os.path.splitext(downloaded_video_path)
                downloaded_video_path = base + ".mp4"
    except Exception as e:
        logger.error(f"Failed to download video: {e}")
        raise e

    logger.info(f"Video downloaded to {downloaded_video_path}. Extracting audio...")

    # Extract audio using ffmpeg (convert to 16kHz wav for Whisper)
    try:
        (
            ffmpeg
            .input(downloaded_video_path)
            .output(audio_path, acodec='pcm_s16le', ac=1, ar='16k')
            .overwrite_output()
            .run(quiet=True)
        )
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg audio extraction failed: {e.stderr.decode('utf8')}")
        raise e

    logger.info("Extracting frames (1 frame every 5 seconds)...")

    # Extract 1 frame every 5 seconds for OCR
    try:
        (
            ffmpeg
            .input(downloaded_video_path)
            .filter('fps', fps=1/5)
            .output(os.path.join(frames_dir, 'frame_%04d.jpg'), **{'qscale:v': 2})
            .overwrite_output()
            .run(quiet=True)
        )
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg frame extraction failed: {e.stderr.decode('utf8')}")
        raise e

    logger.info(f"Ingestion complete. Audio: {audio_path}, Frames: {frames_dir}")
    
    # Optionally, we can delete the raw video file here to save space
    if os.path.exists(downloaded_video_path):
        os.remove(downloaded_video_path)
        
    return frames_dir, audio_path

# Quick test if run directly
if __name__ == "__main__":
    test_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" # example
    # frames, audio = download_video(test_url)
    # print(f"Output frames: {frames}, Output audio: {audio}")
