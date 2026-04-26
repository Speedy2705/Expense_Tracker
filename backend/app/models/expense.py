from beanie import Document, PydanticObjectId
from datetime import datetime, date, timezone
from typing import Optional
from pymongo import ASCENDING
from pymongo import IndexModel


class Expense(Document):
    user_id: PydanticObjectId
    amount_paise: int
    category: str
    description: str
    date: date
    created_at: datetime
    idempotency_key: Optional[str] = None

    def __init__(self, **data):
        if "created_at" not in data or data["created_at"] is None:
            data["created_at"] = datetime.now(timezone.utc)
        super().__init__(**data)

    class Settings:
        name = "expenses"
        indexes = [
            IndexModel([("user_id", ASCENDING)]),
            IndexModel([("idempotency_key", ASCENDING)], unique=True, sparse=True)
        ]
