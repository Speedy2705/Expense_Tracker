from beanie import Document
from datetime import datetime, timezone
from pymongo import ASCENDING
from pymongo import IndexModel


class User(Document):
    email: str
    hashed_password: str
    created_at: datetime

    def __init__(self, **data):
        if "created_at" not in data or data["created_at"] is None:
            data["created_at"] = datetime.now(timezone.utc)
        super().__init__(**data)

    class Settings:
        name = "users"
        indexes = [IndexModel([("email", ASCENDING)], unique=True)]
