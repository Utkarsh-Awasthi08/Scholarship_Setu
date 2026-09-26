import os
from datetime import datetime, timedelta, timezone
from typing import Iterable, Optional

import jwt
from fastapi import Depends, HTTPException, Request, Response, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from pwdlib import PasswordHash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import User


password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)
TOKEN_COOKIE_NAME = "scholarsetu_access_token"


def _jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET", "")
    if not secret or secret == "replace-with-a-long-random-secret":
        raise RuntimeError("JWT_SECRET must be set to a long random value before starting the API.")
    return secret


def _token_lifetime() -> timedelta:
    minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    return timedelta(minutes=max(5, minutes))


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, password_digest: Optional[str]) -> bool:
    return bool(password_digest) and password_hash.verify(password, password_digest)


def create_access_token(user: User) -> str:
    expires_at = datetime.now(timezone.utc) + _token_lifetime()
    payload = {"sub": user.id, "role": user.role, "exp": expires_at}
    return jwt.encode(payload, _jwt_secret(), algorithm=os.getenv("JWT_ALGORITHM", "HS256"))


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=TOKEN_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=os.getenv("ENVIRONMENT", "development").lower() == "production",
        samesite="lax",
        max_age=int(_token_lifetime().total_seconds()),
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(TOKEN_COOKIE_NAME, path="/")


def _unauthorized(detail: str = "Authentication is required.") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials if credentials else request.cookies.get(TOKEN_COOKIE_NAME)
    if not token:
        raise _unauthorized()

    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[os.getenv("JWT_ALGORITHM", "HS256")])
        user_id = payload.get("sub")
    except (jwt.InvalidTokenError, RuntimeError):
        raise _unauthorized("Your session is invalid or has expired.")

    if not user_id:
        raise _unauthorized("Your session is invalid.")

    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user or not user.is_active:
        raise _unauthorized("This account is unavailable.")
    return user


def require_role(*roles: str):
    allowed_roles = set(roles)

    async def role_dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this resource.")
        return user

    return role_dependency


def verify_google_credential(credential: str) -> dict:
    client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    if not client_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google sign-in is not configured.")
    try:
        payload = id_token.verify_oauth2_token(credential, google_requests.Request(), client_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google sign-in could not be verified.")

    if not payload.get("email_verified") or not payload.get("email") or not payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google did not provide a verified email address.")
    return payload
