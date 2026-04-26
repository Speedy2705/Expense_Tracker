from fastapi import APIRouter, HTTPException, Response, Depends
from app.schemas.user import SignUpRequest, SignInRequest, UserResponse
from app.models.user import User
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user
from app.config import settings

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
async def signup(body: SignUpRequest, response: Response) -> UserResponse:
    """Register a new user"""
    existing_user = await User.find_one(User.email == body.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=body.email, hashed_password=hash_password(body.password))
    await user.insert()
    
    token = create_access_token({"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return UserResponse(id=str(user.id), email=user.email, created_at=user.created_at)


@router.post("/signin", response_model=UserResponse)
async def signin(body: SignInRequest, response: Response) -> UserResponse:
    """Authenticate user and return access token"""
    user = await User.find_one(User.email == body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user.id)})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return UserResponse(id=str(user.id), email=user.email, created_at=user.created_at)


@router.post("/signout")
async def signout(response: Response):
    """Sign out user by clearing the access token cookie"""
    response.delete_cookie("access_token")
    return {"message": "Signed out"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Get current authenticated user"""
    return UserResponse(id=str(current_user.id), email=current_user.email, created_at=current_user.created_at)
