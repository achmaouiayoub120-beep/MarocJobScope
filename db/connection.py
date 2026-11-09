import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL

load_dotenv()

REQUIRED_ENV_VARS = ("DB_USER", "DB_HOST", "DB_PORT", "DB_NAME")
OPTIONAL_ENV_VARS = ("DB_PASSWORD",)

missing = [name for name in REQUIRED_ENV_VARS if os.getenv(name) is None]
if missing:
    raise RuntimeError(
        f"Missing environment variables: {', '.join(missing)}. "
        "Copy .env.example to .env and fill it in."
    )

for name in ("DB_USER", "DB_HOST", "DB_NAME"):
    if not os.getenv(name):
        raise RuntimeError(f"{name} must not be empty.")

try:
    DB_PORT = int(os.getenv("DB_PORT"))
except (TypeError, ValueError) as exc:
    raise RuntimeError("DB_PORT must be an integer.") from exc

if not 0 < DB_PORT < 65536:
    raise RuntimeError("DB_PORT must be between 1 and 65535.")

DB_HOST = os.getenv("DB_HOST")
DB_PASSWORD = os.getenv("DB_PASSWORD") or ""
LOCAL_HOSTS = ("localhost", "127.0.0.1")

if not DB_PASSWORD and DB_HOST.strip().lower() not in LOCAL_HOSTS:
    raise RuntimeError(
        "DB_PASSWORD must be set when DB_HOST is neither localhost nor 127.0.0.1."
    )

DATABASE_URL = URL.create(
    "postgresql+psycopg",
    username=os.getenv("DB_USER"),
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=os.getenv("DB_NAME"),
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def test_connection():
    with engine.connect() as conn:
        version = conn.execute(text("SELECT version();")).scalar()
        print("Connected :", version)


if __name__ == "__main__":
    test_connection()
