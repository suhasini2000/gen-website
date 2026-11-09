import asyncio
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

try:
    from backend.database import create_pool, initialize_schema, seed_default_content
except ModuleNotFoundError:
    from database import create_pool, initialize_schema, seed_default_content


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


async def migrate() -> None:
    mongo_url = os.environ.get("MONGO_SOURCE_URL")
    if not mongo_url:
        raise RuntimeError("MONGO_SOURCE_URL must point to the existing MongoDB database.")

    mongo_client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    pool = None
    try:
        mongo_client.admin.command("ping")
        source_db = mongo_client[os.environ.get("MONGO_DB_NAME", "gen_website")]
        content_doc = source_db.site_content.find_one({"key": "main"})
        enquiries = list(source_db.enquiries.find({}, {"_id": 0}))

        pool = await create_pool()
        await initialize_schema(pool)

        async with pool.acquire() as connection:
            async with connection.transaction():
                existing_content = await connection.fetchval(
                    "SELECT 1 FROM site_content WHERE id = 1"
                )
                if content_doc is not None and existing_content is None:
                    content_doc.pop("_id", None)
                    content_doc.pop("key", None)
                    version = int(content_doc.pop("content_version", 2))
                    await connection.execute(
                        """
                        INSERT INTO site_content (id, content, content_version)
                        VALUES (1, $1::jsonb, $2)
                        ON CONFLICT (id) DO NOTHING
                        """,
                        json.dumps(content_doc),
                        version,
                    )

                for enquiry in enquiries:
                    await connection.execute(
                        """
                        INSERT INTO enquiries
                            (id, student_name, phone, course, mode, message, unit, created_at)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        ON CONFLICT (id) DO NOTHING
                        """,
                        str(enquiry["id"]),
                        enquiry["student_name"],
                        enquiry["phone"],
                        enquiry["course"],
                        enquiry["mode"],
                        enquiry.get("message", ""),
                        enquiry.get("unit", "main"),
                        enquiry["created_at"],
                    )

        await seed_default_content(pool)
        content_count = await pool.fetchval("SELECT count(*) FROM site_content")
        enquiry_count = await pool.fetchval("SELECT count(*) FROM enquiries")
        print(
            "Migration complete: "
            f"{content_count} site-content record(s), "
            f"{enquiry_count} enquiry record(s) in PostgreSQL."
        )
    finally:
        if pool is not None:
            await pool.close()
        mongo_client.close()


if __name__ == "__main__":
    asyncio.run(migrate())
