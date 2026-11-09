"""raw baseline: extensions, raw schema and job_postings landing table

Revision ID: 0001
Revises:
Create Date: 2026-11-09

"""

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute("CREATE EXTENSION IF NOT EXISTS unaccent")

    op.execute("CREATE SCHEMA IF NOT EXISTS raw")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS raw.job_postings (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            source varchar(50) NOT NULL,
            source_url text NOT NULL,
            source_job_id varchar(100) NOT NULL,
            payload jsonb NOT NULL,
            html_hash char(64) NOT NULL,
            ingested_at timestamptz NOT NULL DEFAULT now()
        )
        """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS ux_job_postings_source_job_id
        ON raw.job_postings (source, source_job_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS raw.job_postings")
    op.execute("DROP SCHEMA IF EXISTS raw")
