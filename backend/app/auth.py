from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext

from .database import get_db
from .models import User
from .schemas import RegisterSchema, LoginSchema
from .dependencies import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_token(user):
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=8)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing:
        raise HTTPException(400, "Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=pwd_context.hash(data.password),
        role="customer"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful",
        "user_id": user.id
    }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user or not pwd_context.verify(
        form_data.password, user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    return {
        "access_token": create_token(user),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
