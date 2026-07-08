import json
import logging
import time
from groq import AsyncGroq
from fastapi import HTTPException
from pydantic import ValidationError
from .config import config
from .models import PollutionAnalysisResult

logger = logging.getLogger("groq_vision")

# Initialize reusable Groq client
if config.GROQ_API_KEY:
    groq_client = AsyncGroq(api_key=config.GROQ_API_KEY)
else:
    groq_client = None

PROMPT = """You are an advanced Environmental Monitoring AI.

Analyze this uploaded image carefully.
Determine whether pollution is present.
Inspect every visible region of the image.

Look for:
* plastic bottles
* plastic bags
* wrappers
* litter
* garbage
* overflowing bins
* industrial waste
* construction debris
* chemical waste
* smoke
* smog
* burning waste
* dirty rivers
* polluted lakes
* sewage
* oil spills
* hazardous waste
* electronic waste
* biomedical waste
* dead vegetation caused by pollution

Also identify:
* roads
* rivers
* buildings
* vehicles
* trees
* humans
* factories
* water bodies
* sky
* animals

Estimate pollution severity.
Provide confidence.
Provide a short environmental assessment.
Provide recommended municipal action.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside JSON.

The JSON MUST exactly match this structure:
{
  "is_polluted": true/false,
  "pollution_level": "None" | "Low" | "Medium" | "High" | "Critical",
  "confidence": number (0-100),
  "pollutants_found": ["array", "of", "strings"],
  "objects_detected": ["array", "of", "strings"],
  "environment_type": "string",
  "description": "string",
  "recommended_action": "string",
  "risk_score": number (0-100),
  "hazard_category": "Plastic Waste" | "Solid Waste" | "Industrial Waste" | "Air Pollution" | "Water Pollution" | "Construction Waste" | "Biomedical Waste" | "E-Waste" | "Mixed Pollution" | "Unknown",
  "requires_immediate_attention": true/false
}
"""

async def analyze_pollution(base64_image: str) -> PollutionAnalysisResult:
    if not groq_client:
        logger.error("Groq client not initialized due to missing API key.")
        raise HTTPException(status_code=503, detail="AI Service is currently unavailable (Missing API Key).")
    
    start_time = time.time()
    logger.info(f"Sending request to Groq model: {config.GROQ_MODEL_NAME}")
    
    try:
        response = await groq_client.chat.completions.create(
            model=config.GROQ_MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1024
        )
        
        elapsed_time = time.time() - start_time
        logger.info(f"Received response from Groq in {elapsed_time:.2f} seconds.")
        
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Empty response from AI")
            
        # Clean potential markdown (though json_object format usually prevents this)
        content = content.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON
        parsed_json = json.loads(content)
        
        # Validate using Pydantic
        result = PollutionAnalysisResult(**parsed_json)
        logger.info("Successfully parsed and validated AI JSON response.")
        return result
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from AI: {e}\nRaw content: {content}")
        raise HTTPException(status_code=500, detail="Invalid JSON response from AI")
        
    except ValidationError as e:
        logger.error(f"Pydantic validation failed for AI response: {e}\nRaw content: {content}")
        raise HTTPException(status_code=500, detail="AI response did not match required schema")
        
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        # Identify specific Groq errors if possible, e.g., RateLimitError
        error_msg = str(e)
        if "rate limit" in error_msg.lower():
            raise HTTPException(status_code=429, detail="AI Service rate limit exceeded. Please try again later.")
        elif "timeout" in error_msg.lower():
            raise HTTPException(status_code=504, detail="AI Service timed out.")
        raise HTTPException(status_code=500, detail="Failed to connect to AI Service.")
