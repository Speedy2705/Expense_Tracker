from app.models.expense import Expense
from pymongo.errors import DuplicateKeyError
from typing import Tuple


async def get_or_create_expense(expense_data: dict) -> Tuple[Expense, bool]:
    # First try to find existing expense by idempotency key
    existing_expense = await Expense.find_one(Expense.idempotency_key == expense_data["idempotency_key"])
    if existing_expense:
        return existing_expense, False

    # If not found, try to insert new expense
    new_expense = Expense(**expense_data)
    try:
        await new_expense.insert()
        return new_expense, True
    except DuplicateKeyError:
        # Race condition: another request inserted the same idempotency key
        # Fetch the existing one and return it
        existing = await Expense.find_one(Expense.idempotency_key == expense_data["idempotency_key"])
        return existing, False
