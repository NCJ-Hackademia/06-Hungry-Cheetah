from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database import get_collection
from app.models.listing import (
    ListingCreate, ListingUpdate, ListingResponse, ListingListResponse,
    ListingInDB, ListingStatus, ListingFilter
)
from app.auth.dependencies import get_current_active_user, get_current_farmer, get_current_buyer
from app.models.user import UserInDB
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/marketplace", tags=["marketplace"])

@router.post("/listings", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_data: ListingCreate,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Create a new marketplace listing."""
    listings_collection = get_collection("listings")
    animals_collection = get_collection("animals")
    
    # Verify the animal belongs to the current user
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(listing_data.animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create listing for this animal"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )
    
    # Create listing
    listing_dict = listing_data.dict()
    listing_dict["seller_id"] = current_user.id
    listing_dict["created_at"] = datetime.utcnow()
    listing_dict["updated_at"] = datetime.utcnow()
    
    result = await listings_collection.insert_one(listing_dict)
    listing_dict["_id"] = str(result.inserted_id)
    
    return ListingResponse(**listing_dict)

@router.get("/listings", response_model=ListingListResponse)
async def get_listings(
    seller_id: Optional[str] = Query(None, description="Filter by seller ID"),
    status: Optional[ListingStatus] = Query(None, description="Filter by status"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    species: Optional[str] = Query(None, description="Filter by animal species"),
    location: Optional[str] = Query(None, description="Filter by location"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get marketplace listings with optional filtering."""
    listings_collection = get_collection("listings")
    animals_collection = get_collection("animals")
    users_collection = get_collection("users")
    
    # Build filter
    filter_query = {}
    if seller_id:
        filter_query["seller_id"] = seller_id
    if status:
        filter_query["status"] = status
    if min_price is not None:
        filter_query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in filter_query:
            filter_query["price"]["$lte"] = max_price
        else:
            filter_query["price"] = {"$lte": max_price}
    
    # Count total documents
    total = await listings_collection.count_documents(filter_query)
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = listings_collection.find(filter_query).skip(skip).limit(size).sort("created_at", -1)
    
    listings = []
    async for listing in cursor:
        listing["_id"] = str(listing["_id"])
        
        # Get additional details
        try:
            animal = await animals_collection.find_one({"_id": ObjectId(listing["animal_id"])})
            seller = await users_collection.find_one({"_id": ObjectId(listing["seller_id"])})
            
            listing_response = ListingResponse(
                **listing,
                seller_name=seller["name"] if seller else None,
                animal_name=animal["name"] if animal else None,
                animal_health_score=animal["health_score"] if animal else None
            )
            listings.append(listing_response)
        except Exception as e:
            # Skip listings with invalid references
            continue
    
    return ListingListResponse(
        listings=listings,
        total=total,
        page=page,
        size=size
    )

@router.get("/listings/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get a specific marketplace listing."""
    listings_collection = get_collection("listings")
    animals_collection = get_collection("animals")
    users_collection = get_collection("users")
    
    try:
        listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )
        
        listing["_id"] = str(listing["_id"])
        
        # Get additional details
        animal = await animals_collection.find_one({"_id": ObjectId(listing["animal_id"])})
        seller = await users_collection.find_one({"_id": ObjectId(listing["seller_id"])})
        
        # Increment view count
        await listings_collection.update_one(
            {"_id": ObjectId(listing_id)},
            {"$inc": {"views": 1}}
        )
        
        return ListingResponse(
            **listing,
            seller_name=seller["name"] if seller else None,
            animal_name=animal["name"] if animal else None,
            animal_health_score=animal["health_score"] if animal else None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid listing ID"
        )

@router.put("/listings/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: str,
    listing_update: ListingUpdate,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Update a marketplace listing."""
    listings_collection = get_collection("listings")
    
    try:
        # Check if listing exists and belongs to current user
        listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )
        
        if listing["seller_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this listing"
            )
        
        # Update listing
        update_data = listing_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await listings_collection.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": update_data}
        )
        
        # Get updated listing
        updated_listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
        updated_listing["_id"] = str(updated_listing["_id"])
        
        return ListingResponse(**updated_listing)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid listing ID"
        )

@router.delete("/listings/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Delete a marketplace listing."""
    listings_collection = get_collection("listings")
    
    try:
        # Check if listing exists and belongs to current user
        listing = await listings_collection.find_one({"_id": ObjectId(listing_id)})
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )
        
        if listing["seller_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this listing"
            )
        
        # Delete listing
        await listings_collection.delete_one({"_id": ObjectId(listing_id)})
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid listing ID"
        )

@router.get("/my/listings", response_model=ListingListResponse)
async def get_my_listings(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Get current user's marketplace listings."""
    listings_collection = get_collection("listings")
    animals_collection = get_collection("animals")
    
    # Count total documents
    total = await listings_collection.count_documents({"seller_id": current_user.id})
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = listings_collection.find({"seller_id": current_user.id}).skip(skip).limit(size).sort("created_at", -1)
    
    listings = []
    async for listing in cursor:
        listing["_id"] = str(listing["_id"])
        
        # Get animal details
        try:
            animal = await animals_collection.find_one({"_id": ObjectId(listing["animal_id"])})
            listing_response = ListingResponse(
                **listing,
                seller_name=current_user.name,
                animal_name=animal["name"] if animal else None,
                animal_health_score=animal["health_score"] if animal else None
            )
            listings.append(listing_response)
        except Exception as e:
            continue
    
    return ListingListResponse(
        listings=listings,
        total=total,
        page=page,
        size=size
    )
