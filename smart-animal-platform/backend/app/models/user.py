from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    FARMER = "farmer"
    BUYER = "buyer"
    VET = "vet"
    ADMIN = "admin"

class KYCStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    role: UserRole
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    location: Optional[str] = None
    kyc_status: Optional[KYCStatus] = None

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    kyc_status: KYCStatus = KYCStatus.PENDING
    rating: float = 0.0
    total_transactions: int = 0
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

class UserResponse(UserBase):
    id: str
    kyc_status: KYCStatus
    rating: float
    total_transactions: int
    created_at: datetime
    is_active: bool

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
