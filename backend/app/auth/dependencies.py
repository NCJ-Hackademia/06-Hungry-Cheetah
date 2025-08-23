from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import get_collection
from app.auth.jwt import verify_token
from app.models.user import TokenData, UserInDB
from bson import ObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserInDB:
    """Get the current authenticated user."""
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    users_collection = get_collection("users")
    user = await users_collection.find_one({"_id": ObjectId(token_data.user_id)})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Convert MongoDB document to UserInDB model
    user["_id"] = str(user["_id"])
    return UserInDB(**user)

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_current_farmer(current_user: UserInDB = Depends(get_current_active_user)) -> UserInDB:
    """Get the current user if they are a farmer."""
    if current_user.role.value != "farmer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Farmer role required."
        )
    return current_user

async def get_current_buyer(current_user: UserInDB = Depends(get_current_active_user)) -> UserInDB:
    """Get the current user if they are a buyer."""
    if current_user.role.value != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Buyer role required."
        )
    return current_user

async def get_current_vet(current_user: UserInDB = Depends(get_current_active_user)) -> UserInDB:
    """Get the current user if they are a veterinarian."""
    if current_user.role.value != "vet":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Veterinarian role required."
        )
    return current_user
