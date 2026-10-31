
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models, billing_models

from .auth import router as auth_router
from .products import router as products_router
from .plans import router as plans_router
from .subscriptions import router as subscriptions_router
from .billing import router as invoices_router
from .payments import router as payments_router
from .discounts import router as discounts_router
from .reports import router as reports_router


# Register all database models before creating tables.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Brightloop Subscription Management System",
    description="Subscription, recurring billing and revenue management",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API routers.
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(plans_router)
app.include_router(subscriptions_router)
app.include_router(invoices_router)
app.include_router(payments_router)
app.include_router(discounts_router)
app.include_router(reports_router)


@app.get("/")
def home():
    return {
        "message": "Brightloop API is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
