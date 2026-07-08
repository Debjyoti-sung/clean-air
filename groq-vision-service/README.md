# AI-Powered Pollution Detection Module

This is a standalone Python microservice built with FastAPI that provides an AI-powered image analysis endpoint. It uses Groq's multimodal vision models to detect and classify environmental pollution from uploaded images.

## Features

- **FastAPI Backend:** High-performance, asynchronous Python web framework.
- **Groq Vision Integration:** Uses the official `groq` Python SDK to analyze images for pollution signatures.
- **Structured JSON Output:** Uses Pydantic models and strict prompts to ensure the AI always returns exactly the requested JSON format.
- **Robust Image Validation:** Validates file type, checks for corruption, and enforces a 10MB size limit.
- **Error Handling:** Returns structured JSON error messages for all failure modes (e.g., Rate limits, missing keys, invalid images).

## Prerequisites

- Python 3.12+
- A valid Groq API Key (added to the project root `.env` file)

## Environment Setup

The service reads configuration from the parent directory's `.env` file (`../.env`).

Ensure your `.env` contains:

```env
GROQ_API_KEY=your_groq_api_key_here
# Optional: Override the model name
# GROQ_MODEL_NAME=llama-3.2-90b-vision-preview
```

## Installation

1. Navigate to the module directory:
   ```bash
   cd groq-vision-service
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI server using Uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.
Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs`.

## API Endpoint

**`POST /api/pollution/analyze`**

Accepts a `multipart/form-data` request with a single file field named `image`.

### Example Request (cURL)

```bash
curl -X POST "http://localhost:8000/api/pollution/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@path/to/your/image.jpg"
```

### Example Response (Success)

```json
{
  "is_polluted": true,
  "pollution_level": "High",
  "confidence": 92,
  "pollutants_found": [
    "plastic bottles",
    "garbage"
  ],
  "objects_detected": [
    "river",
    "trees"
  ],
  "environment_type": "Water Body",
  "description": "A river heavily contaminated with floating plastic waste and general garbage.",
  "recommended_action": "Municipal cleaning required",
  "risk_score": 85,
  "hazard_category": "Plastic Waste",
  "requires_immediate_attention": false
}
```

## Folder Structure

```
groq-vision-service/
├── config.py         # Environment configuration loader
├── main.py           # FastAPI application and endpoint definitions
├── models.py         # Pydantic data models for validation
├── services.py       # Groq API integration and prompt logic
├── utils.py          # Image validation and encoding utilities
├── requirements.txt  # Python dependencies
└── README.md         # This documentation
```

## Troubleshooting

- **503 Service Unavailable:** The `GROQ_API_KEY` is missing from the `.env` file.
- **429 Too Many Requests:** Your Groq API key has hit its rate limit.
- **413 Payload Too Large:** The uploaded image exceeds the 10 MB limit.
- **500 Internal Server Error:** Usually indicates the AI failed to return valid JSON that matches the Pydantic schema. Check the server logs for the raw AI response.
