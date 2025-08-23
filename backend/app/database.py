from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    """Create database connection."""
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        db.db = db.client[settings.mongodb_db]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection."""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")

async def create_indexes():
    """Create database indexes for better performance."""
    try:
        # Users collection indexes
        await db.db.users.create_index("email", unique=True)
        await db.db.users.create_index("phone")
        
        # Animals collection indexes
        await db.db.animals.create_index("owner_id")
        await db.db.animals.create_index("species")
        await db.db.animals.create_index("status")
        await db.db.animals.create_index([("location", "2dsphere")])
        
        # Listings collection indexes
        await db.db.listings.create_index("seller_id")
        await db.db.listings.create_index("animal_id")
        await db.db.listings.create_index("status")
        await db.db.listings.create_index("price")
        await db.db.listings.create_index([("location", "2dsphere")])
        
        # IoT metrics collection indexes
        await db.db.iot_metrics.create_index("animal_id")
        await db.db.iot_metrics.create_index("timestamp")
        await db.db.iot_metrics.create_index([("animal_id", 1), ("timestamp", -1)])
        
        # Orders collection indexes
        await db.db.orders.create_index("buyer_id")
        await db.db.orders.create_index("seller_id")
        await db.db.orders.create_index("status")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

def get_collection(collection_name: str):
    """Get a MongoDB collection."""
    return db.db[collection_name]
