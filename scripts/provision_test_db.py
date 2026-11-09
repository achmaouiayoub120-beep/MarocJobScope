"""Create the isolated test database.

Strict guard: this script only ever creates/uses `marocjobscope_test`.
Schema objects are owned by Alembic; run `alembic upgrade head` afterwards.

Usage:
    python -m scripts.provision_test_db
"""

from pathlib import Path

from sqlalchemy import create_engine, text

from db.connection import DATABASE_URL

TEST_DB_NAME = "marocjobscope_test"


def main() -> None:
    admin_url = DATABASE_URL.set(database="postgres")
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT", pool_pre_ping=True)

    with admin_engine.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name;"),
            {"name": TEST_DB_NAME},
        ).scalar()

        if exists:
            print(f"Database {TEST_DB_NAME} already exists; leaving it untouched.")
        else:
            conn.execute(text(f'CREATE DATABASE "{TEST_DB_NAME}";'))
            print(f"Database {TEST_DB_NAME} created.")

    print("Schema is managed by Alembic. Next step: alembic upgrade head")
    print(f"Alembic config: {Path('alembic.ini').resolve()}")


if __name__ == "__main__":
    main()
