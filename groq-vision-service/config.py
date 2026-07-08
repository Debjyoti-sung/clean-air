import os
from pathlib import Path
from dotenv import load_dotenv

# Path to the root .env file (assuming groq-vision-service is in the root directory)
env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    # Llama 3.2 Vision is Groq's multimodal model
    GROQ_MODEL_NAME = os.getenv("GROQ_MODEL_NAME", "llama-3.2-90b-vision-preview")

config = Config()

if not config.GROQ_API_KEY:
    import logging
    logging.warning("GROQ_API_KEY is not set in the environment. AI Vision features will not work.")
