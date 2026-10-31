from pathlib import Path
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from .database import Base, engine, SessionLocal
from .models import User

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")
    if not email or not password:
        raise RuntimeError("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env")
    if len(password) < 12 or len(password.encode("utf-8")) > 72:
        raise ValueError("Admin password must be 12–72 UTF-8 bytes")
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("Account already exists; no changes made.")
            return
        db.add(User(name="Brightloop Admin", email=email,
                    password=pwd_context.hash(password), role="admin"))
        db.commit()
        print("Admin account created.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
