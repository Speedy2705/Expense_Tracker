import pytest
from httpx import AsyncClient
from app.main import app
from app.database import init_db
import uuid
from datetime import date


async def test_create_expense_returns_201():
    """Test creating a new expense returns 201"""
    # Initialize database
    await init_db()

    # Create test client
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        # First, sign up a user
        signup_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        response = await client.post("/auth/signup", json=signup_data)
        assert response.status_code == 200

        # Now create an expense
        expense_data = {
            "amount_rupees": 199.50,
            "category": "Food",
            "description": "Lunch at restaurant",
            "date": "2024-01-15",
            "idempotency_key": str(uuid.uuid4())
        }

        headers = {"Idempotency-Key": expense_data["idempotency_key"]}
        response = await client.post("/expenses", json=expense_data, headers=headers)

        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["amount_rupees"] == "199.50"
        assert data["category"] == "Food"


async def test_idempotency_returns_200_on_retry():
    """Test that retrying with same idempotency key returns 200 and same expense"""
    # Initialize database
    await init_db()

    # Create test client
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        # First, sign up a user
        signup_data = {
            "email": "test2@example.com",
            "password": "testpass123"
        }
        response = await client.post("/auth/signup", json=signup_data)
        assert response.status_code == 200

        # Create expense data with fixed idempotency key
        idempotency_key = str(uuid.uuid4())
        expense_data = {
            "amount_rupees": 99.99,
            "category": "Transport",
            "description": "Bus fare",
            "date": "2024-01-16",
            "idempotency_key": idempotency_key
        }

        headers = {"Idempotency-Key": idempotency_key}

        # First request
        response1 = await client.post("/expenses", json=expense_data, headers=headers)
        assert response1.status_code == 201
        data1 = response1.json()

        # Second request with same idempotency key
        response2 = await client.post("/expenses", json=expense_data, headers=headers)
        assert response2.status_code == 200
        data2 = response2.json()

        # Both should return the same expense ID
        assert data1["id"] == data2["id"]
        assert data1["amount_rupees"] == "99.99"
        assert data2["amount_rupees"] == "99.99"