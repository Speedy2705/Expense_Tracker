from fastapi import APIRouter, Depends, Header
from fastapi.responses import JSONResponse
from typing import Optional, List
from pymongo import DESCENDING
from app.schemas.expense import CreateExpenseRequest, ExpenseResponse
from app.models.expense import Expense
from app.utils.auth import get_current_user
from app.models.user import User
from app.utils.idempotency import get_or_create_expense

router = APIRouter()


@router.post("/expenses", response_model=ExpenseResponse)
async def create_expense(
    body: CreateExpenseRequest,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    current_user: User = Depends(get_current_user),
):
    # Sanity check (schema already validates this)
    if body.amount_rupees <= 0:
        raise ValueError("Amount must be greater than 0")

    expense_data = {
        "user_id": current_user.id,
        "amount_paise": round(body.amount_rupees * 100),  # Convert to integer paise
        "category": body.category,
        "description": body.description,
        "date": body.date,
        "idempotency_key": idempotency_key,
    }

    expense, created = await get_or_create_expense(expense_data)
    response_data = ExpenseResponse.from_expense(expense).model_dump(mode="json")

    status_code = 201 if created else 200
    return JSONResponse(content=response_data, status_code=status_code)


@router.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    category: Optional[str] = None,
    sort: str = "date_desc",
    current_user: User = Depends(get_current_user),
):
    query = Expense.find(Expense.user_id == current_user.id)

    if category and category.strip():
        query = query.find(Expense.category == category.strip())

    # Sort by date descending, then created_at descending
    expenses = await query.sort([("date", DESCENDING), ("created_at", DESCENDING)]).to_list()

    return [ExpenseResponse.from_expense(e) for e in expenses]
