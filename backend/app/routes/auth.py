from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.auth import (
    clear_auth_cookie,
    create_access_token,
    get_current_user,
    hash_password,
    set_auth_cookie,
    verify_google_credential,
    verify_password,
)
from app.database import get_db
from app.models import Student, User
from app.schemas import GoogleLoginRequest, LoginRequest, RegisterRequest, UserResponse


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def user_response(user: User) -> dict:
    return {"id": user.id, "email": user.email, "role": user.role}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, response: Response, db: AsyncSession = Depends(get_db)):
    email = request.email.lower()
    existing = await db.execute(select(User).filter(User.email == email))
    if existing.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account already exists for this email. Please sign in.")

    user = User(email=email, password_hash=hash_password(request.password), role="student")
    db.add(user)
    await db.commit()
    await db.refresh(user)
    set_auth_cookie(response, create_access_token(user))
    return user_response(user)


@router.post("/login", response_model=UserResponse)
async def login(request: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    identifier = request.identifier.strip().lower()
    query = select(User).outerjoin(Student).filter(or_(User.email == identifier, Student.pan_card == identifier.upper()))
    result = await db.execute(query)
    user = result.scalars().first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email/PAN or password.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account is inactive.")

    set_auth_cookie(response, create_access_token(user))
    return user_response(user)


@router.post("/google", response_model=UserResponse)
async def google_login(request: GoogleLoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    credential = verify_google_credential(request.credential)
    email = credential["email"].lower()
    google_subject = credential["sub"]
    result = await db.execute(select(User).filter(or_(User.google_subject == google_subject, User.email == email)))
    user = result.scalars().first()

    if user:
        if user.google_subject and user.google_subject != google_subject:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This email is linked to another Google account.")
        user.google_subject = google_subject
    else:
        user = User(email=email, google_subject=google_subject, role="student")
        db.add(user)

    await db.commit()
    await db.refresh(user)
    set_auth_cookie(response, create_access_token(user))
    return user_response(user)


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return user_response(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response):
    clear_auth_cookie(response)
