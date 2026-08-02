import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_resume_local.db")

# Convert postgres:// to postgresql:// for SQLAlchemy compatibility if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"PostgreSQL connection fallback to SQLite: {e}")
    DATABASE_URL = "sqlite:///./ai_resume_local.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def auto_migrate():
    """Ensure missing columns in existing tables are added automatically."""
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "jobs" in tables:
            columns = [c["name"] for c in inspector.get_columns("jobs")]
            with engine.begin() as conn:
                if "salary_min" not in columns:
                    conn.exec_driver_sql("ALTER TABLE jobs ADD COLUMN salary_min FLOAT DEFAULT 0.0")
                if "salary_max" not in columns:
                    conn.exec_driver_sql("ALTER TABLE jobs ADD COLUMN salary_max FLOAT DEFAULT 0.0")
                if "requirements" not in columns:
                    conn.exec_driver_sql("ALTER TABLE jobs ADD COLUMN requirements TEXT DEFAULT ''")
    except Exception as err:
        print(f"Auto-migration warning: {err}")

auto_migrate()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

