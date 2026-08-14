import ollama
import json
import logging
import re

logger = logging.getLogger(__name__)

def extract_restaurant_info(transcript: str, ocr_text: str, model_name: str = "phi3") -> dict:
    """
    Passes the combined context to Ollama (running a small SLM like phi3 or llama3:8b)
    to extract structured JSON information.
    """
    logger.info(f"Loading '{model_name}' via Ollama to extract entities...")
    
    # Construct the prompt
    prompt = f"""
    You are an expert data extractor. Your task is to extract hidden restaurant details 
    from the following YouTube video transcript and on-screen OCR text.
    
    ### Audio Transcript ###
    {transcript}
    
    ### On-Screen OCR Text ###
    {ocr_text}
    
    Based on the above context, extract the following information and return it strictly as a JSON object.
    Do NOT output any markdown, conversational text, or explanations. Only the raw JSON.
    
    Required JSON Schema:
    {{
        "restaurant_name": "Name of the restaurant or stall",
        "location": "Address, neighborhood, or landmark mentioned",
        "dishes": [
            {{
                "name": "Name of the dish",
                "price": "Price if mentioned, else null"
            }}
        ],
        "vibe": "A short 1-sentence summary of the vibe or sentiment from the reviewer"
    }}
    """
    
    try:
        response = ollama.chat(model=model_name, messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ])
        
        raw_output = response['message']['content']
        logger.debug(f"Raw LLM output: {raw_output}")
        
        # Clean up output to ensure it's just JSON (sometimes LLMs wrap in ```json)
        json_str = raw_output.replace("```json", "").replace("```", "").strip()
        
        # Try to parse it
        extracted_data = json.loads(json_str)
        logger.info("Successfully extracted structured JSON from Ollama.")
        return extracted_data
        
    except Exception as e:
        logger.error(f"Failed to extract info via Ollama: {e}")
        # Return empty structured data if failed
        return {
            "restaurant_name": None,
            "location": None,
            "dishes": [],
            "vibe": None,
            "error": str(e)
        }

if __name__ == "__main__":
    pass
