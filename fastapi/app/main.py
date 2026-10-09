from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import create_tables
from app.routers import items


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once when the server starts
    create_tables()
    yield


app = FastAPI(
    title="Hackathon API",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Lets the frontend call the API directly from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


@api.get("/health")
def health():
    return {"status": "ok"}


# Register new routers here
api.include_router(items.router)

app.include_router(api)
