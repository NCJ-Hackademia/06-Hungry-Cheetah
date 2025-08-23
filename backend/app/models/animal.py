from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AnimalStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"
    DECEASED = "deceased"

class AnimalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    species: str = Field(..., min_length=1, max_length=50)
    breed: str = Field(..., min_length=1, max_length=50)
    dob: datetime
    weight: float = Field(..., gt=0)
    location: str = Field(..., min_length=1)

class AnimalCreate(AnimalBase):
    owner_id: str

class AnimalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    species: Optional[str] = Field(None, min_length=1, max_length=50)
    breed: Optional[str] = Field(None, min_length=1, max_length=50)
    weight: Optional[float] = Field(None, gt=0)
    location: Optional[str] = Field(None, min_length=1)
    status: Optional[AnimalStatus] = None
    health_score: Optional[float] = Field(None, ge=0, le=100)
    vaccination: Optional[List[str]] = None

class AnimalInDB(AnimalBase):
    id: str = Field(alias="_id")
    owner_id: str
    photos: List[str] = []
    health_score: float = Field(default=80.0, ge=0, le=100)
    vaccination: List[str] = []
    status: AnimalStatus = AnimalStatus.ACTIVE
    created_at: datetime
    updated_at: datetime

class AnimalResponse(AnimalBase):
    id: str
    owner_id: str
    photos: List[str]
    health_score: float
    vaccination: List[str]
    status: AnimalStatus
    created_at: datetime

class AnimalListResponse(BaseModel):
    animals: List[AnimalResponse]
    total: int
    page: int
    size: int
