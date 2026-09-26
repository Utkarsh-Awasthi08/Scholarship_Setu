import os
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./scholarship.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def apply_compatibility_migrations():
    """Add columns required by authenticated accounts to existing SQLite installs.

    New installations are created from the SQLAlchemy models. The small migration
    keeps earlier hackathon databases usable without silently deleting their data.
    """
    if not DATABASE_URL.startswith("sqlite"):
        return

    async with engine.begin() as conn:
        def migrate(sync_conn):
            inspector = inspect(sync_conn)
            tables = set(inspector.get_table_names())
            for table_name, column_name, definition in (
                ("students", "user_id", "VARCHAR"),
                ("chat_sessions", "user_id", "VARCHAR"),
            ):
                if table_name in tables:
                    columns = {column["name"] for column in inspector.get_columns(table_name)}
                    if column_name not in columns:
                        sync_conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}"))
        await conn.run_sync(migrate)
