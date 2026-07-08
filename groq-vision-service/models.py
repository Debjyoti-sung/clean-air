from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class PollutionLevel(str, Enum):
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class HazardCategory(str, Enum):
    PLASTIC_WASTE = "Plastic Waste"
    SOLID_WASTE = "Solid Waste"
    INDUSTRIAL_WASTE = "Industrial Waste"
    AIR_POLLUTION = "Air Pollution"
    WATER_POLLUTION = "Water Pollution"
    CONSTRUCTION_WASTE = "Construction Waste"
    BIOMEDICAL_WASTE = "Biomedical Waste"
    E_WASTE = "E-Waste"
    MIXED_POLLUTION = "Mixed Pollution"
    UNKNOWN = "Unknown"

class PollutionAnalysisResult(BaseModel):
    is_polluted: bool = Field(..., description="True if pollution is detected in the image.")
    pollution_level: PollutionLevel = Field(..., description="Severity level of the pollution.")
    confidence: int = Field(..., ge=0, le=100, description="Confidence score between 0 and 100.")
    pollutants_found: List[str] = Field(..., description="List of specific pollutants found (e.g., 'plastic bottles', 'smoke').")
    objects_detected: List[str] = Field(..., description="List of other objects detected (e.g., 'river', 'trees', 'buildings').")
    environment_type: str = Field(..., description="Type of environment (e.g., 'Urban', 'Rural', 'Water Body').")
    description: str = Field(..., description="Brief environmental assessment of the scene.")
    recommended_action: str = Field(..., description="Recommended municipal action to address the issue.")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score from 0 to 100 based on severity.")
    hazard_category: HazardCategory = Field(..., description="The main category of the hazard.")
    requires_immediate_attention: bool = Field(..., description="True if the situation requires urgent intervention.")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message description")
    detail: Optional[str] = Field(None, description="Detailed error information")
