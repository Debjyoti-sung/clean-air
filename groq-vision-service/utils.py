import base64
import io
from fastapi import UploadFile, HTTPException
from PIL import Image

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

async def validate_image(file: UploadFile) -> bytes:
    """
    Validates the uploaded file for type and size, and returns the raw bytes.
    Raises HTTPException if validation fails.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Missing file")
    
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed types: {', '.join(ALLOWED_CONTENT_TYPES)}")
    
    # Read file content
    contents = await file.read()
    
    # Validate size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10 MB.")
    
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty upload.")
    
    # Validate it's a real image using Pillow
    try:
        image = Image.open(io.BytesIO(contents))
        image.verify() # Verify that it is, in fact, an image
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file.")
    
    return contents

def encode_image_to_base64(image_bytes: bytes) -> str:
    """
    Converts image bytes to a base64 encoded string.
    """
    return base64.b64encode(image_bytes).decode('utf-8')
