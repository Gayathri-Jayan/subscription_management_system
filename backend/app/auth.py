from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext
from .database import get_db
from .models import User
from .schemas import RegisterSchema, LoginSchema, StaffCreateSchema
from .dependencies import SECRET_KEY, ALGORITHM, require_roles

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_token(user):
    payload = {"sub": str(user.id), "role": user.role,
               "exp": datetime.utcnow() + timedelta(hours=8)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(409, "Email already registered")
    user = User(name=data.name, email=data.email,
                password=pwd_context.hash(data.password), role="customer")
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registration successful", "user_id": user.id}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(401, "Incorrect email or password")
    return {"access_token": create_token(user), "token_type": "bearer",
            "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}

@router.post("/staff", status_code=201)
def create_staff(data: StaffCreateSchema, db: Session = Depends(get_db),
                 admin=Depends(require_roles("admin"))):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(409, "Email already registered")
    staff = User(name=data.name, email=data.email,
                 password=pwd_context.hash(data.password), role="staff")
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return {"message": "Staff account created", "user_id": staff.id}
