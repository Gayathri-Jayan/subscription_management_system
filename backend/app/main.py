
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models

from .auth import router as auth_router
from .products import router as products_router
from .plans import router as plans_router
from .subscriptions import router as subscriptions_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Brightloop Subscription Management System",
    description="Subscription, recurring billing and revenue management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(plans_router)
app.include_router(subscriptions_router)


@app.get("/")
def home():
    return {
        "message": "Brightloop API is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
