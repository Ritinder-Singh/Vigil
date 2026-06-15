import os
import bcrypt
import jwt

from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Cookie
from dotenv import load_dotenv


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-dev-secret")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24


def verify_password(plain: str) -> bool:
    stored = ADMIN_PASSWORD.encode()
    try:
        return bcrypt.checkpw(plain.encode(), stored)
    except Exception:
        return plain == ADMIN_PASSWORD


def create_token() -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": "admin", "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid Token")


def require_auth(access_token: str | None = Cookie(default=None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not Authenticated")
    return decode_token(access_token)
