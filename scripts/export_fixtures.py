"""Export up to 100 raw payloads per source as UTF-8 JSONL fixtures.

Usage:
    python -m scripts.export_fixtures [--out-dir tests/fixtures] [--max-per-source 100]

Only non-demo sources are exported: demo_* rows are synthetic and must never be
used to evaluate parsing or deduplication quality.
"""

import argparse
import json
import re
from pathlib import Path

from sqlalchemy import text

from db.connection import engine

DEFAULT_OUT_DIR = Path("tests/fixtures")
DEFAULT_MAX_PER_SOURCE = 100

QUERY = text("""
    SELECT source, payload
    FROM (
        SELECT source,
               payload,
               row_number() OVER (
                   PARTITION BY source
                   ORDER BY ingested_at DESC, id DESC
               ) AS rn
        FROM raw.job_postings
        WHERE left(source, 5) <> 'demo_'
    ) ranked
    WHERE rn <= :max_per_source
    ORDER BY source, rn
""")


def _filename_for(source: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9._-]+", "_", source).strip("._-")
    return f"{slug or 'source'}.jsonl"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR)
    parser.add_argument("--max-per-source", type=int, default=DEFAULT_MAX_PER_SOURCE)
    args = parser.parse_args()

    if args.max_per_source <= 0:
        parser.error("--max-per-source must be a positive integer.")

    with engine.connect() as conn:
        conn.execute(text("SET TRANSACTION READ ONLY"))
        rows = conn.execute(QUERY, {"max_per_source": args.max_per_source}).all()

    if not rows:
        print("No non-demo payloads found. Nothing exported.")
        return

    payloads: dict[str, list[object]] = {}
    for source, payload in rows:
        payloads.setdefault(source, []).append(payload)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    print("source | exported | file")
    for source in sorted(payloads):
        path = args.out_dir / _filename_for(source)
        with path.open("w", encoding="utf-8", newline="\n") as handle:
            for payload in payloads[source]:
                handle.write(json.dumps(payload, ensure_ascii=False, sort_keys=True))
                handle.write("\n")
        print(f"{source} | {len(payloads[source])} | {path.as_posix()}")


if __name__ == "__main__":
    main()
