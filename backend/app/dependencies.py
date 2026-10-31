
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from .database import get_db
from .models import User


# Load environment variables from backend/.env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

# Read JWT secret securely from environment
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY or len(SECRET_KEY) < 32:
    raise RuntimeError(
        "Set SECRET_KEY to a random value of at least 32 characters in backend/.env"
    )

ALGORITHM = "HS256"

# Swagger accepts JWT directly as a Bearer token
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_roles(*roles):
    def checker(user=Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user

    return checker
