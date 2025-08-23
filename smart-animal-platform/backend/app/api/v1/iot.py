from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database import get_collection
from app.models.iot import (
    IoTMetricsCreate, IoTMetricsUpdate, IoTMetricsResponse, IoTMetricsListResponse,
    IoTMetricsInDB, FeedingStatus, SignalStrength
)
from app.auth.dependencies import get_current_active_user, get_current_farmer
from app.models.user import UserInDB
from bson import ObjectId
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/iot", tags=["iot"])

@router.post("/metrics", response_model=IoTMetricsResponse, status_code=status.HTTP_201_CREATED)
async def create_iot_metrics(
    metrics_data: IoTMetricsCreate,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Create new IoT metrics for an animal."""
    iot_collection = get_collection("iot_metrics")
    animals_collection = get_collection("animals")
    
    # Verify the animal belongs to the current user
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(metrics_data.animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create metrics for this animal"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )
    
    # Create metrics
    metrics_dict = metrics_data.dict()
    metrics_dict["timestamp"] = datetime.utcnow()
    
    result = await iot_collection.insert_one(metrics_dict)
    metrics_dict["_id"] = str(result.inserted_id)
    
    return IoTMetricsResponse(**metrics_dict)

@router.get("/metrics", response_model=IoTMetricsListResponse)
async def get_iot_metrics(
    animal_id: Optional[str] = Query(None, description="Filter by animal ID"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get IoT metrics with optional filtering."""
    iot_collection = get_collection("iot_metrics")
    animals_collection = get_collection("animals")
    
    # Build filter
    filter_query = {}
    if animal_id:
        # Verify the animal belongs to the current user
        try:
            animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
            if not animal:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Animal not found"
                )
            
            if animal["owner_id"] != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to access metrics for this animal"
                )
                
            filter_query["animal_id"] = animal_id
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid animal ID"
            )
    else:
        # If no animal_id specified, get all animals owned by current user
        user_animals = await animals_collection.find({"owner_id": current_user.id}).to_list(length=None)
        animal_ids = [str(animal["_id"]) for animal in user_animals]
        if animal_ids:
            filter_query["animal_id"] = {"$in": animal_ids}
        else:
            # No animals found, return empty response
            return IoTMetricsListResponse(
                metrics=[],
                total=0,
                animal_id=animal_id or "all",
                last_updated=datetime.utcnow()
            )
    
    # Count total documents
    total = await iot_collection.count_documents(filter_query)
    
    # Get latest metrics
    cursor = iot_collection.find(filter_query).sort("timestamp", -1).limit(limit)
    
    metrics = []
    async for metric in cursor:
        metric["_id"] = str(metric["_id"])
        metrics.append(IoTMetricsResponse(**metric))
    
    return IoTMetricsListResponse(
        metrics=metrics,
        total=total,
        animal_id=animal_id or "all",
        last_updated=datetime.utcnow()
    )

@router.get("/metrics/{animal_id}/latest", response_model=IoTMetricsResponse)
async def get_latest_iot_metrics(
    animal_id: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get the latest IoT metrics for a specific animal."""
    iot_collection = get_collection("iot_metrics")
    animals_collection = get_collection("animals")
    
    # Verify the animal belongs to the current user
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access metrics for this animal"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )
    
    # Get latest metrics
    latest_metric = await iot_collection.find_one(
        {"animal_id": animal_id},
        sort=[("timestamp", -1)]
    )
    
    if not latest_metric:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No metrics found for this animal"
        )
    
    latest_metric["_id"] = str(latest_metric["_id"])
    return IoTMetricsResponse(**latest_metric)

@router.put("/metrics/{animal_id}/simulate", response_model=IoTMetricsResponse)
async def simulate_iot_metrics(
    animal_id: str,
    current_user: UserInDB = Depends(get_current_farmer)
):
    """Simulate new IoT metrics for an animal (for demo purposes)."""
    iot_collection = get_collection("iot_metrics")
    animals_collection = get_collection("animals")
    
    # Verify the animal belongs to the current user
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to simulate metrics for this animal"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )
    
    # Generate simulated metrics
    simulated_metrics = {
        "animal_id": animal_id,
        "temperature": round(random.uniform(37.0, 40.0), 1),
        "humidity": round(random.uniform(50.0, 80.0), 1),
        "activity_level": round(random.uniform(60.0, 100.0), 1),
        "feeding_status": random.choice([FeedingStatus.FED, FeedingStatus.HUNGRY]),
        "water_level": round(random.uniform(30.0, 100.0), 1),
        "battery_level": round(random.uniform(80.0, 100.0), 1),
        "signal_strength": random.choice([SignalStrength.WEAK, SignalStrength.MEDIUM, SignalStrength.STRONG]),
        "timestamp": datetime.utcnow(),
        "location": {"lat": 30.7333, "lng": 76.7794},
        "additional_data": {}
    }
    
    # Insert new metrics
    result = await iot_collection.insert_one(simulated_metrics)
    simulated_metrics["_id"] = str(result.inserted_id)
    
    return IoTMetricsResponse(**simulated_metrics)

@router.get("/metrics/{animal_id}/history", response_model=IoTMetricsListResponse)
async def get_iot_metrics_history(
    animal_id: str,
    hours: int = Query(24, ge=1, le=168, description="Number of hours to look back"),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get IoT metrics history for a specific animal."""
    iot_collection = get_collection("iot_metrics")
    animals_collection = get_collection("animals")
    
    # Verify the animal belongs to the current user
    try:
        animal = await animals_collection.find_one({"_id": ObjectId(animal_id)})
        if not animal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Animal not found"
            )
        
        if animal["owner_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access metrics for this animal"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid animal ID"
        )
    
    # Calculate time range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)
    
    # Get metrics within time range
    filter_query = {
        "animal_id": animal_id,
        "timestamp": {"$gte": start_time, "$lte": end_time}
    }
    
    # Count total documents
    total = await iot_collection.count_documents(filter_query)
    
    # Get metrics
    cursor = iot_collection.find(filter_query).sort("timestamp", -1)
    
    metrics = []
    async for metric in cursor:
        metric["_id"] = str(metric["_id"])
        metrics.append(IoTMetricsResponse(**metric))
    
    return IoTMetricsListResponse(
        metrics=metrics,
        total=total,
        animal_id=animal_id,
        last_updated=end_time
    )
