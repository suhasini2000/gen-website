import os
import uuid
from contextlib import asynccontextmanager

import httpx
from datetime import datetime, timezone
from typing import Literal
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

try:
    from backend.clerk_auth import clerk_router, require_user
    from backend.database import (
        create_pool,
        get_content as fetch_content,
        get_enquiries as fetch_enquiries,
        initialize_schema,
        insert_enquiry,
        save_content as store_content,
        seed_default_content,
    )
except ModuleNotFoundError:
    from clerk_auth import clerk_router, require_user
    from database import (
        create_pool,
        get_content as fetch_content,
        get_enquiries as fetch_enquiries,
        initialize_schema,
        insert_enquiry,
        save_content as store_content,
        seed_default_content,
    )

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
pool = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global pool
    pool = await create_pool()
    await initialize_schema(pool)
    await seed_default_content(pool)
    try:
        yield
    finally:
        await pool.close()
        pool = None


app = FastAPI(title="GenInfotech API", lifespan=lifespan)
api = APIRouter(prefix="/api")


def new_id() -> str:
    return str(uuid.uuid4())


class Enquiry(BaseModel):
    id: str = Field(default_factory=new_id)
    student_name: str
    phone: str
    course: str
    mode: str
    message: str = ""
    unit: Literal["main", "vedic_maths", "ai_vista"] = "main"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EnquiryCreate(BaseModel):
    student_name: str
    phone: str
    course: str
    mode: str
    message: str = ""
    unit: Literal["main", "vedic_maths", "ai_vista"] = "main"

class Course(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str = Field(min_length=1)
    category: str = "Other Courses"
    description: str = ""
    description_te: str = ""
    duration: str = ""
    topics: list[str] = []
    featured: bool = False

    @field_validator("topics")
    @classmethod
    def strip_topics(cls, v: list[str]) -> list[str]:
        return [t.strip() for t in v if t.strip()]

class Project(BaseModel):
    id: str = Field(default_factory=new_id)
    title: str = Field(min_length=1)
    description: str = ""
    technology: str = ""
    student: str = ""
    image: str = ""

class GalleryItem(BaseModel):
    id: str = Field(default_factory=new_id)
    title: str = ""
    image: str = Field(min_length=1)

class Faculty(BaseModel):
    name: str = ""
    bio: str = ""

class SocialLink(BaseModel):
    id: str = Field(default_factory=new_id)
    platform: Literal["youtube", "instagram", "facebook"]
    label: str = ""
    url: str = Field(min_length=1)

class Reviews(BaseModel):
    youtube_videos: list[str] = []
    google_reviews_url: str = ""
    instagram_reel_url: str = ""

    @field_validator("youtube_videos")
    @classmethod
    def strip_videos(cls, v: list[str]) -> list[str]:
        return [u.strip() for u in v if u.strip()]

class Branding(BaseModel):
    logo_url: str = ""

class SiteContent(BaseModel):
    courses: list[Course] = []
    projects: list[Project] = []
    gallery: list[GalleryItem] = []
    faculty: Faculty = Faculty()
    social_links: list[SocialLink] = []
    reviews: Reviews = Reviews()
    branding: Branding = Branding()

async def verified_primary_email(user_id: str) -> str:
    async with httpx.AsyncClient(base_url="https://api.clerk.com", timeout=8.0) as http:
        res = await http.get(f"/v1/users/{user_id}", headers={"Authorization": f"Bearer {os.environ['CLERK_SECRET_KEY']}"})
    if res.status_code != 200:
        raise HTTPException(status_code=502, detail="Could not verify account")
    data = res.json()
    primary = next((e for e in data.get("email_addresses", []) if e.get("id") == data.get("primary_email_address_id")), None)
    if not primary or (primary.get("verification") or {}).get("status") != "verified":
        return ""
    return primary.get("email_address", "").strip().lower()

async def ensure_admin(user: dict) -> None:
    admins = {e.strip().lower() for e in os.environ.get("ADMIN_EMAIL", "").split(",") if e.strip()}
    email = await verified_primary_email(user["user_id"]) if user.get("user_id") else ""
    if not admins or not email or email not in admins:
        raise HTTPException(status_code=403, detail="Admin access required")

async def load_content() -> SiteContent:
    if pool is None:
        raise RuntimeError("Database connection pool is not initialized.")
    return SiteContent(**await fetch_content(pool))

async def save_content(content: SiteContent) -> None:
    if pool is None:
        raise RuntimeError("Database connection pool is not initialized.")
    await store_content(pool, content.model_dump())

@api.get("/")
async def root():
    return {"message": "GenInfotech API ready"}

@api.post("/enquiries", response_model=Enquiry)
async def create_enquiry(payload: EnquiryCreate):
    item = Enquiry(**payload.model_dump())
    if pool is None:
        raise RuntimeError("Database connection pool is not initialized.")
    await insert_enquiry(pool, item.model_dump())
    return item

@api.get("/content", response_model=SiteContent)
async def get_content():
    return await load_content()

@api.put("/content", response_model=SiteContent)
async def update_content(payload: SiteContent, user: dict = Depends(require_user)):
    await ensure_admin(user)
    await save_content(payload)
    return payload

@api.get("/enquiries")
async def get_enquiries(user: dict = Depends(require_user)):
    await ensure_admin(user)
    if pool is None:
        raise RuntimeError("Database connection pool is not initialized.")
    return await fetch_enquiries(pool)

app.include_router(api)
app.include_router(clerk_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])
