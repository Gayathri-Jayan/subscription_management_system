
from .database import Base, engine, SessionLocal
from .models import User
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()

try:
    email = "admin@brightloop.com"

    existing = db.query(User).filter(
        User.email == email
    ).first()

    if not existing:
        admin = User(
            name="Brightloop Admin",
            email=email,
            password=pwd_context.hash("Admin@12345"),
            role="admin"
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully!")
    else:
        print("Admin already exists!")

finally:
    db.close()
