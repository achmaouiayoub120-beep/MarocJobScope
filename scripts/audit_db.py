"""Read-only audit of the connected PostgreSQL database.

Usage:
    python -m scripts.audit_db

All environment variables required by db.connection are read from .env and/or
the process environment. No credential is ever printed.
"""

from sqlalchemy import text

from db.connection import engine

EXTENSION_NAMES = ("pg_trgm", "unaccent", "pgcrypto", "pg_stat_statements")


def show_section(title: str) -> None:
    print(f"\n=== {title} ===")


def show_rows(result) -> None:
    keys = list(result.keys())
    print(" | ".join(keys))
    for row in result:
        print(" | ".join("" if value is None else str(value) for value in row))


def main() -> None:
    with engine.connect() as conn:
        show_section("CONNECTION")
        show_rows(
            conn.execute(
                text(
                    "SELECT current_database() AS database, current_user AS db_user, "
                    "inet_server_addr()::text AS server_addr, "
                    "inet_server_port() AS server_port, version() AS version;"
                )
            )
        )

        show_section("DATABASES")
        show_rows(
            conn.execute(
                text(
                    "SELECT datname, pg_size_pretty(pg_database_size(datname)) AS size "
                    "FROM pg_database WHERE datistemplate = false ORDER BY datname;"
                )
            )
        )

        show_section("EXTENSIONS AVAILABLE (selected)")
        show_rows(
            conn.execute(
                text(
                    "SELECT name, default_version FROM pg_available_extensions "
                    "WHERE name = ANY(:names) ORDER BY name;"
                ),
                {"names": list(EXTENSION_NAMES)},
            )
        )

        show_section("EXTENSIONS INSTALLED IN CURRENT DATABASE")
        show_rows(
            conn.execute(
                text(
                    "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
                )
            )
        )

        show_section("SCHEMAS")
        show_rows(
            conn.execute(
                text(
                    "SELECT schema_name FROM information_schema.schemata "
                    "WHERE schema_name NOT LIKE 'pg\\_%' "
                    "AND schema_name <> 'information_schema' ORDER BY schema_name;"
                )
            )
        )

        raw_table = conn.execute(
            text("SELECT to_regclass('raw.job_postings')::text AS regclass;")
        ).scalar()

        show_section("RAW.JOB_POSTINGS")
        if raw_table is None:
            print("raw.job_postings does not exist in this database.")
            return

        print(f"to_regclass: {raw_table}")

        show_section("COLUMNS")
        show_rows(
            conn.execute(
                text(
                    "SELECT ordinal_position, column_name, data_type, "
                    "is_nullable, column_default "
                    "FROM information_schema.columns "
                    "WHERE table_schema = 'raw' AND table_name = 'job_postings' "
                    "ORDER BY ordinal_position;"
                )
            )
        )

        show_section("CONSTRAINTS")
        show_rows(
            conn.execute(
                text(
                    "SELECT conname, contype, pg_get_constraintdef(oid) AS definition "
                    "FROM pg_constraint "
                    "WHERE conrelid = 'raw.job_postings'::regclass ORDER BY conname;"
                )
            )
        )

        show_section("INDEXES")
        show_rows(
            conn.execute(
                text(
                    "SELECT indexname, indexdef FROM pg_indexes "
                    "WHERE schemaname = 'raw' AND tablename = 'job_postings' "
                    "ORDER BY indexname;"
                )
            )
        )

        show_section("ROW COUNT")
        show_rows(
            conn.execute(text("SELECT count(*) AS total FROM raw.job_postings;"))
        )

        show_section("ROWS PER SOURCE")
        show_rows(
            conn.execute(
                text(
                    "SELECT source, count(*) AS rows FROM raw.job_postings "
                    "GROUP BY source ORDER BY source;"
                )
            )
        )


if __name__ == "__main__":
    main()
