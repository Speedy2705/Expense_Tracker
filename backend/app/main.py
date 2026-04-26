from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.routers import auth, expenses


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage FastAPI startup and shutdown events"""
    await init_db()
    yield


app = FastAPI(title="Expense Tracker API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request, exc):
    errors = exc.errors()
    first_error = errors[0] if errors else {"msg": "Validation error"}
    message = first_error.get("msg", "Validation error").replace("Value error, ", "")
    return JSONResponse(status_code=422, content={"detail": message})


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(expenses.router, tags=["expenses"])
