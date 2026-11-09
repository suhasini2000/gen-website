import json
import os
from typing import Any

import asyncpg


SCHEMA = """
CREATE TABLE IF NOT EXISTS site_content (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    content JSONB NOT NULL,
    content_version SMALLINT NOT NULL DEFAULT 2
);

CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT NOT NULL,
    mode TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT 'main'
        CHECK (unit IN ('main', 'vedic_maths', 'ai_vista')),
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
    ON enquiries (created_at DESC);
"""


async def create_pool() -> asyncpg.Pool:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL must be set to connect to PostgreSQL.")
    return await asyncpg.create_pool(database_url)


async def initialize_schema(pool: asyncpg.Pool) -> None:
    await pool.execute(SCHEMA)


async def seed_default_content(pool: asyncpg.Pool) -> None:
    try:
        from backend.default_content import default_courses, default_reviews, default_social_links
    except ModuleNotFoundError:
        from default_content import default_courses, default_reviews, default_social_links

    content = {
        "courses": default_courses(),
        "projects": [],
        "gallery": [],
        "faculty": {"name": "", "bio": ""},
        "social_links": default_social_links(),
        "reviews": default_reviews(),
        "branding": {"logo_url": ""},
    }
    await pool.execute(
        """
        INSERT INTO site_content (id, content, content_version)
        VALUES (1, $1::jsonb, 2)
        ON CONFLICT (id) DO NOTHING
        """,
        json.dumps(content),
    )


async def get_content(pool: asyncpg.Pool) -> dict[str, Any]:
    row = await pool.fetchrow("SELECT content FROM site_content WHERE id = 1")
    if row is None:
        await seed_default_content(pool)
        row = await pool.fetchrow("SELECT content FROM site_content WHERE id = 1")
    if row is None:
        raise RuntimeError("Site content row was not available after initialization.")
    content = row["content"]
    return json.loads(content) if isinstance(content, str) else content


async def save_content(pool: asyncpg.Pool, content: dict[str, Any]) -> None:
    await pool.execute(
        """
        INSERT INTO site_content (id, content, content_version)
        VALUES (1, $1::jsonb, 2)
        ON CONFLICT (id) DO UPDATE
        SET content = EXCLUDED.content,
            content_version = EXCLUDED.content_version
        """,
        json.dumps(content),
    )


async def insert_enquiry(pool: asyncpg.Pool, enquiry: dict[str, Any]) -> None:
    await pool.execute(
        """
        INSERT INTO enquiries
            (id, student_name, phone, course, mode, message, unit, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """,
        enquiry["id"],
        enquiry["student_name"],
        enquiry["phone"],
        enquiry["course"],
        enquiry["mode"],
        enquiry["message"],
        enquiry["unit"],
        enquiry["created_at"],
    )


async def get_enquiries(pool: asyncpg.Pool, limit: int = 500) -> list[dict[str, Any]]:
    rows = await pool.fetch(
        """
        SELECT id, student_name, phone, course, mode, message, unit, created_at
        FROM enquiries
        ORDER BY created_at DESC
        LIMIT $1
        """,
        limit,
    )
    return [dict(row) for row in rows]
