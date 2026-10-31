
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

from .database import Base, engine, SessionLocal
from .models import User

# Load environment variables from backend/.env
load_dotenv()

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

db = SessionLocal()

try:
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not email or not password:
        raise ValueError(
            "ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env"
        )

    if len(password) < 12:
        raise ValueError("Admin password must contain at least 12 characters")

    existing = db.query(User).filter(
        User.email == email
    ).first()

    if not existing:
        admin = User(
            name="Brightloop Admin",
            email=email,
            password=pwd_context.hash(password),
            role="admin"
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully!")

    else:
        print("Admin already exists!")

except Exception:
    db.rollback()
    raise

finally:
    db.close()
