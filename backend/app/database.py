from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings


async def init_db():
    """Initialize MongoDB connection and Beanie ODM"""
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    
    from app.models.user import User
    from app.models.expense import Expense
    
    await init_beanie(database=db, document_models=[User, Expense])
