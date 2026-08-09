from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.utils.config import settings


SQLITE_DATABASE_URL = "sqlite:///./resume_ai.db"

database_url = (settings.DATABASE_URL or "").strip()


if database_url:
    # PostgreSQL / Supabase
    if database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql+psycopg://",
            1,
        )

    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    engine = create_engine(
        database_url,
        pool_pre_ping=True,
    )

    print("[DB] Using PostgreSQL database")

    # Test actual database connection
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        print("[DB] PostgreSQL connection successful")

    except Exception as e:
        print(f"[DB] PostgreSQL connection failed: {e}")
        raise

else:
    # Local development fallback
    engine = create_engine(
        SQLITE_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

    print("[DB] Using local SQLite database")


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()