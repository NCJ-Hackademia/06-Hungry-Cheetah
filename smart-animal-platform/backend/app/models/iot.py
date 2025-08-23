from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class FeedingStatus(str, Enum):
    FED = "fed"
    HUNGRY = "hungry"
    OVERFED = "overfed"

class SignalStrength(str, Enum):
    WEAK = "weak"
    MEDIUM = "medium"
    STRONG = "strong"

class IoTMetricsBase(BaseModel):
    animal_id: str
    temperature: float = Field(..., ge=30, le=45)  # Celsius
    humidity: float = Field(..., ge=0, le=100)     # Percentage
    activity_level: float = Field(..., ge=0, le=100)  # Percentage
    feeding_status: FeedingStatus
    water_level: float = Field(..., ge=0, le=100)  # Percentage
    battery_level: float = Field(..., ge=0, le=100)  # Percentage
    signal_strength: SignalStrength

class IoTMetricsCreate(IoTMetricsBase):
    pass

class IoTMetricsUpdate(BaseModel):
    temperature: Optional[float] = Field(None, ge=30, le=45)
    humidity: Optional[float] = Field(None, ge=0, le=100)
    activity_level: Optional[float] = Field(None, ge=0, le=100)
    feeding_status: Optional[FeedingStatus] = None
    water_level: Optional[float] = Field(None, ge=0, le=100)
    battery_level: Optional[float] = Field(None, ge=0, le=100)
    signal_strength: Optional[SignalStrength] = None

class IoTMetricsInDB(IoTMetricsBase):
    id: str = Field(alias="_id")
    timestamp: datetime
    location: Dict[str, float] = Field(default_factory=dict)  # {lat: float, lng: float}
    additional_data: Dict[str, Any] = Field(default_factory=dict)

class IoTMetricsResponse(IoTMetricsBase):
    id: str
    timestamp: datetime
    location: Dict[str, float]
    additional_data: Dict[str, Any]

class IoTMetricsListResponse(BaseModel):
    metrics: list[IoTMetricsResponse]
    total: int
    animal_id: str
    last_updated: datetime

class IoTAlert(BaseModel):
    animal_id: str
    alert_type: str  # temperature_high, temperature_low, battery_low, etc.
    message: str
    severity: str  # low, medium, high, critical
    timestamp: datetime
    is_resolved: bool = False
