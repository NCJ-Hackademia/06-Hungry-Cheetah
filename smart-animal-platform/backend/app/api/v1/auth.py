from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from app.database import get_collection
from app.auth.jwt import verify_password, get_password_hash, create_access_token
from app.models.user import UserCreate, UserLogin, Token, UserResponse, UserInDB
from bson import ObjectId
from datetime import datetime
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user."""
    users_collection = get_collection("users")
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data.email, "user_id": str(result.inserted_id)}
    )
    
    # Prepare response
    user_response = UserResponse(
        id=str(result.inserted_id),
        email=user_data.email,
        name=user_data.name,
        phone=user_data.phone,
        role=user_data.role,
        location=user_data.location,
        kyc_status="pending",
        rating=0.0,
        total_transactions=0,
        created_at=user_dict["created_at"],
        is_active=True
    )
    
    return Token(access_token=access_token, user=user_response)

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return access token."""
    users_collection = get_collection("users")
    
    # Find user by email
    user = await users_collection.find_one({"email": user_credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])}
    )
    
    # Prepare response
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        phone=user["phone"],
        role=user["role"],
        location=user.get("location"),
        kyc_status=user.get("kyc_status", "pending"),
        rating=user.get("rating", 0.0),
        total_transactions=user.get("total_transactions", 0),
        created_at=user["created_at"],
        is_active=user.get("is_active", True)
    )
    
    return Token(access_token=access_token, user=user_response)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone=current_user.phone,
        role=current_user.role,
        location=current_user.location,
        kyc_status=current_user.kyc_status,
        rating=current_user.rating,
        total_transactions=current_user.total_transactions,
        created_at=current_user.created_at,
        is_active=current_user.is_active
    )

def get_current_user():
    pass
