"""Create the isolated test database and its provisional raw landing table.

Strict guard: this script only ever creates/uses `marocjobscope_test`.
It never connects to (nor modifies) the database named by DB_NAME.

Usage:
    python -m scripts.provision_test_db
"""

from sqlalchemy import create_engine, text

from db.connection import DATABASE_URL

TEST_DB_NAME = "marocjobscope_test"

RAW_DDL = """
CREATE SCHEMA IF NOT EXISTS raw;

CREATE TABLE IF NOT EXISTS raw.job_postings (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source varchar(50) NOT NULL,
    source_url text NOT NULL,
    source_job_id varchar(100),
    payload jsonb NOT NULL,
    html_hash char(64) NOT NULL,
    ingested_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ux_job_postings_source_url_hash UNIQUE (source, source_url, html_hash)
);

CREATE INDEX IF NOT EXISTS ix_job_postings_source_job_id
    ON raw.job_postings (source, source_job_id);
"""


def show_rows(result) -> None:
    keys = list(result.keys())
    print(" | ".join(keys))
    for row in result:
        print(" | ".join("" if value is None else str(value) for value in row))


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

    test_url = DATABASE_URL.set(database=TEST_DB_NAME)
    test_engine = create_engine(test_url, pool_pre_ping=True)

    with test_engine.begin() as conn:
        for statement in RAW_DDL.split(";"):
            if statement.strip():
                conn.execute(text(statement))

    print("\n=== TEST DATABASE STATE ===")
    with test_engine.connect() as conn:
        show_rows(
            conn.execute(
                text(
                    "SELECT current_database() AS database, current_user AS db_user, "
                    "version() AS version;"
                )
            )
        )

        print("\n--- raw.job_postings columns ---")
        show_rows(
            conn.execute(
                text(
                    "SELECT ordinal_position, column_name, data_type, is_nullable "
                    "FROM information_schema.columns "
                    "WHERE table_schema = 'raw' AND table_name = 'job_postings' "
                    "ORDER BY ordinal_position;"
                )
            )
        )

        print("\n--- raw.job_postings constraints ---")
        show_rows(
            conn.execute(
                text(
                    "SELECT conname, pg_get_constraintdef(oid) AS definition "
                    "FROM pg_constraint WHERE conrelid = 'raw.job_postings'::regclass "
                    "ORDER BY conname;"
                )
            )
        )

        print("\n--- row count ---")
        show_rows(
            conn.execute(text("SELECT count(*) AS total FROM raw.job_postings;"))
        )


if __name__ == "__main__":
    main()
