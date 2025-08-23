from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ListingStatus(str, Enum):
    ACTIVE = "active"
    SOLD = "sold"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class ListingBase(BaseModel):
    animal_id: str
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=1000)
    price: float = Field(..., gt=0)
    location: str = Field(..., min_length=1)

class ListingCreate(ListingBase):
    seller_id: str

class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    price: Optional[float] = Field(None, gt=0)
    location: Optional[str] = Field(None, min_length=1)
    status: Optional[ListingStatus] = None

class ListingInDB(ListingBase):
    id: str = Field(alias="_id")
    seller_id: str
    status: ListingStatus = ListingStatus.ACTIVE
    views: int = 0
    offers: int = 0
    created_at: datetime
    updated_at: datetime

class ListingResponse(ListingBase):
    id: str
    seller_id: str
    status: ListingStatus
    views: int
    offers: int
    created_at: datetime
    # Include seller and animal details
    seller_name: Optional[str] = None
    animal_name: Optional[str] = None
    animal_health_score: Optional[float] = None

class ListingListResponse(BaseModel):
    listings: List[ListingResponse]
    total: int
    page: int
    size: int

class ListingFilter(BaseModel):
    seller_id: Optional[str] = None
    status: Optional[ListingStatus] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    species: Optional[str] = None
    location: Optional[str] = None
