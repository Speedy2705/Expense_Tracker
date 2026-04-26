from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional
from app.models.expense import Expense


class CreateExpenseRequest(BaseModel):
    amount_rupees: float
    category: str
    description: str
    date: date
    idempotency_key: str

    @field_validator("amount_rupees")
    @classmethod
    def validate_amount_rupees(cls, v):
        if v <= 0:
            raise ValueError("Amount must be greater than 0")
        return v

    @field_validator("category", "description")
    @classmethod
    def strip_strings(cls, v):
        return v.strip()


class ExpenseResponse(BaseModel):
    id: str
    amount_rupees: str
    category: str
    description: str
    date: date
    created_at: datetime

    @classmethod
    def from_expense(cls, expense: Expense) -> "ExpenseResponse":
        return cls(
            id=str(expense.id),
            amount_rupees=f"{expense.amount_paise / 100:.2f}",
            category=expense.category,
            description=expense.description,
            date=expense.date,
            created_at=expense.created_at,
        )