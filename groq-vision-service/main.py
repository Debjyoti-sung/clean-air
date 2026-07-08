import logging
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from .models import ErrorResponse, PollutionAnalysisResult
from .utils import validate_image, encode_image_to_base64
from .services import analyze_pollution

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("pollution_module")

app = FastAPI(
    title="AI Pollution Detection Module",
    description="Analyzes images for environmental pollution using Groq Vision Models",
    version="1.0.0"
)

# Allow CORS for development (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": str(exc)}
    )

@app.post(
    "/api/pollution/analyze",
    response_model=PollutionAnalysisResult,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request (e.g., invalid image)"},
        413: {"model": ErrorResponse, "description": "Payload Too Large (e.g., > 10MB)"},
        429: {"model": ErrorResponse, "description": "Too Many Requests (Rate Limit)"},
        500: {"model": ErrorResponse, "description": "Internal Server Error (e.g., Groq API failure, parsing error)"},
        503: {"model": ErrorResponse, "description": "Service Unavailable (e.g., Missing API key)"},
        504: {"model": ErrorResponse, "description": "Gateway Timeout"}
    }
)
async def analyze_image_endpoint(image: UploadFile = File(...)):
    """
    Endpoint to upload an image and get an AI pollution analysis.
    """
    logger.info(f"Received request to analyze image: {image.filename if image else 'Unknown'}")
    
    # 1. Validate Image (Size, Type, Format)
    image_bytes = await validate_image(image)
    logger.info("Image validated successfully.")
    
    # 2. Convert to Base64
    base64_image = encode_image_to_base64(image_bytes)
    
    # 3 & 4. Send to Groq, Receive, Parse, Validate, and Return
    result = await analyze_pollution(base64_image)
    
    logger.info("Analysis completed successfully.")
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
