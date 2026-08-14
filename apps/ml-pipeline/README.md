# Hidden Eats ML Pipeline Setup Guide

This guide will walk you through setting up the custom Machine Learning pipeline on your local machine (specifically tailored for an NVIDIA RTX 4060). This pipeline extracts hidden restaurants and dishes from YouTube videos using 100% free, local AI models.

## Architecture Overview
- **Ingestion**: `yt-dlp` & `ffmpeg`
- **Transcription**: `faster-whisper` (Base model)
- **Vision (OCR)**: `EasyOCR`
- **NLP / JSON Extraction**: Microsoft `Phi-3` via `Ollama`

## Prerequisites

Before installing the Python dependencies, you must install the following core system tools:

### 1. Python 3.10+
Ensure Python is installed.
- **Windows**: Download from [python.org](https://www.python.org/downloads/). Make sure to check "Add Python to PATH" during installation.
- **Linux/macOS**: `sudo apt install python3` or `brew install python3`.

### 2. FFmpeg (Required for audio/video extraction)
- **Windows**: Install via `winget`:
  ```bash
  winget install ffmpeg
  ```
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

### 3. NVIDIA CUDA Toolkit (CRITICAL FOR RTX 4060)
To ensure the models run on your GPU (and not your CPU), you need CUDA.
1. Download and install [CUDA Toolkit 11.8 or 12.1](https://developer.nvidia.com/cuda-downloads) from NVIDIA's website.
2. Download and install [cuDNN](https://developer.nvidia.com/cudnn).

### 4. Ollama (For the Local LLM)
Ollama allows you to run large language models locally with extreme efficiency.
1. Download Ollama from [ollama.com](https://ollama.com/) and install it.
2. Open your terminal and pull the lightweight `phi3` model:
   ```bash
   ollama pull phi3
   ```
   *(This will download a ~2.3GB model file).*

---

## Installation

1. Navigate to this directory in your terminal:
   ```bash
   cd apps/ml-pipeline
   ```

2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   # Activate on Windows:
   venv\Scripts\activate
   # Activate on Mac/Linux:
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: PyTorch will automatically install the CUDA version if you are on Windows/Linux. If you face issues with models running on the CPU instead of the GPU, reinstall PyTorch specifically for CUDA: `pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`)*

---

## Running the Pipeline

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The server will start on `http://localhost:8000`.

## API Endpoints

### 1. Process a Single Video
Send a POST request to `/process-video`:
```bash
curl -X POST http://localhost:8000/process-video \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"}'
```

### 2. Scrape and Batch Process (NEW)
Send a search query or a YouTube channel URL to `/scrape-and-process`. The server will automatically scrape the top results and process them sequentially to prevent your GPU from crashing.
```bash
curl -X POST http://localhost:8000/scrape-and-process \
  -H "Content-Type: application/json" \
  -d '{"query_or_url": "hidden street food in chennai", "max_results": 3}'
```

Check your terminal logs to see the pipeline downloading, transcribing, reading text, and extracting JSON!
