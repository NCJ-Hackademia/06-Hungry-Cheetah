from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database import get_collection
from app.models.animal import (
    AnimalCreate, AnimalUpdate, AnimalResponse, AnimalListResponse,
    AnimalInDB, AnimalStatus
)
from app.auth.dependencies import get_current_active_user, get_current_farmer
from app.models.user import UserInDB
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/animals", tags=["animals"])

@router.post("/", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
async def create_animal(
    animal_data: AnimalCreate,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Create a new animal."""
    animals_collection = get_collection("animals")
    
    # Set the owner_id to current user
    animal_dict = animal_data.dict()
    animal_dict["owner_id"] = current_user.id
    animal_dict["created_at"] = datetime.utcnow()
    animal_dict["updated_at"] = datetime.utcnow()
    
    result = await animals_collection.insert_one(animal_dict)
    animal_dict["_id"] = str(result.inserted_id)
    
    return AnimalResponse(**animal_dict)

@router.get("/", response_model=AnimalListResponse)
async def get_animals(
    owner_id: Optional[str] = Query(None, description="Filter by owner ID"),
    species: Optional[str] = Query(None, description="Filter by species"),
    status: Optional[AnimalStatus] = Query(None, description="Filter by status"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get list of animals with optional filtering."""
    animals_collection = get_collection("animals")
    
    # Build filter
    filter_query = {}
    if owner_id:
        filter_query["owner_id"] = owner_id
    if species:
        filter_query["species"] = species
    if status:
        filter_query["status"] = status
    
    # Count total documents
    total = await animals_collection.count_documents(filter_query)
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = animals_collection.find(filter_query).skip(skip).limit(size).sort("created_at", -1)
    
    animals = []
    async for animal in cursor:
        animal["_id"] = str(animal["_id"])
        animals.append(AnimalResponse(**animal))
    
    return AnimalListResponse(
        animals=animals,
        total=total,
        page=page,
        size=size
    )

@router.get("/{animal_id}", response_model=AnimalResponse)
async def get_animal(
    animal_id: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get a specific animal by ID."""
    animals_collection = get_collection("animals")
    
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        animal["_id"] = str(animal["_id"])
        return AnimalResponse(**animal)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )

@router.put("/{animal_id}", response_model=AnimalResponse)
async def update_animal(
    animal_id: str,
    animal_update: AnimalUpdate,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Update an animal."""
    animals_collection = get_collection("animals")
    
    try:
        # Check if animal exists and belongs to current user
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this animal"
            )
        
        # Update animal
        update_data = animal_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await animals_collection.update_one(
            {"_id": ObjectId(animal_id)},
            {"$set": update_data}
        )
        
        # Get updated animal
        updated_animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        updated_animal["_id"] = str(updated_animal["_id"])
        
        return AnimalResponse(**updated_animal)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_animal(
    animal_id: str,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Delete an animal."""
    animals_collection = get_collection("animals")
    
    try:
        # Check if animal exists and belongs to current user
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this animal"
            )
        
        # Delete animal
        await animals_collection.delete_one({"_id": ObjectId(animal_id)})
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )

@router.get("/my/animals", response_model=AnimalListResponse)
async def get_my_animals(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Get current user's animals."""
    animals_collection = get_collection("animals")
    
    # Count total documents
    total = await animals_collection.count_documents({"owner_id": current_user.id})
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = animals_collection.find({"owner_id": current_user.id}).skip(skip).limit(size).sort("created_at", -1)
    
    animals = []
    async for animal in cursor:
        animal["_id"] = str(animal["_id"])
        animals.append(AnimalResponse(**animal))
    
    return AnimalListResponse(
        animals=animals,
        total=total,
        page=page,
        size=size
    )
