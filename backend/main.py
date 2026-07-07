import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Air Quality Intelligence Engine", version="v1")

# Configure CORS so Koyel's React frontend can post data securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robust data model checking for inbound reporting transactions
class ReportPayload(BaseModel):
    user_email: EmailStr
    city: str
    aqi_observed: int
    description: str

def send_smtp_email(payload: ReportPayload):
    # Fetch parameters securely from the service container state config
    smtp_host = os.environ.get("SMTP_HOST", "://gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_username = os.environ.get("SMTP_USERNAME")
    smtp_password = os.environ.get("SMTP_PASSWORD")

    if not smtp_username or not smtp_password:
        print("SMTP Auth credentials missing! Aborting email broadcast sequence.")
        return

    # Construct the container formatting framework for the message payload
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = payload.user_email
    msg['Subject'] = f"🔔 Air Quality Report Logged Successfully: {payload.city}"

    body = f"""
    Hello,

    Thank you for contributing to the Air Quality Intelligence Engine. Your environmental field report has been successfully registered.

    --- Report Submission Details ---
    Location: {payload.city}
    Observed Index (AQI): {payload.aqi_observed}
    Field Description: {payload.description}
    
    Our Gemini Vision AI pipelines are currently evaluating this data stream to predict proactive hotspot variations.

    Stay Safe,
    Air Quality Infrastructure Team
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Open a secure connection loop to the live SMTP routing node
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()  # Upgrade the pipeline encryption security layer using TLS
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, payload.user_email, msg.as_string())
        server.quit()
        print(f"Operational update successfully mailed out to destination tracker: {payload.user_email}")
    except Exception as exc:
        print(f"System execution exception failed to dispatch email via SMTP: {str(exc)}")

@app.post("/api/v1/reports/submit")
async def submit_report(payload: ReportPayload, background_tasks: BackgroundTasks):
    # Offload the email execution process into a background thread pool 
    # This responds immediately to the frontend client without forcing network wait lag
    background_tasks.add_task(send_smtp_email, payload)
    
    return {
        "status": "Success",
        "message": "Report logged and tracking notification triggered."
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "smtp-notification-backend-engine"}
