import hashlib
import json

import requests
from sqlalchemy import text

from db.connection import engine

API_URL="https://www.wadifa-info.com/api/v1/concours"
SOURCE="wadifa_info"

def _job_reference(item: dict) -> str | None:
    value = item.get("id") or item.get("url")
    return str(value) if value else None

def save_raw(conn,item:dict):
    job_id = _job_reference(item)
    if job_id is None:
        raise ValueError("Offer has neither id nor url.")

    payload_str = json.dumps(item,sort_keys=True,ensure_ascii=False)
    h = hashlib.sha256(payload_str.encode()).hexdigest()
    query = text("""
        INSERT INTO raw.job_postings (source, source_url, source_job_id, payload, html_hash)
        VALUES (:source, :url, :job_id, CAST(:payload AS JSONB), :hash)
        ON CONFLICT (source, source_job_id) DO NOTHING
    """)
    result = conn.execute(query, {
        "source": SOURCE,
        "url": item.get("url"),
        "job_id": job_id,
        "payload": payload_str,
        "hash": h,
    })

    return result.rowcount

def fetch_all():
    r = requests.get(API_URL,timeout=30)
    r.raise_for_status()
    data = r.json()
    items = data.get("items", [])
    if not items:
        raise ValueError(f"No items found. Keys were: {list(data.keys())}")

    print("Attribution:", json.dumps(data.get("attribution"), indent=2, ensure_ascii=False))

    inserted = 0
    skipped = 0
    with engine.begin() as conn:
        for item in items:
            if _job_reference(item) is None:
                skipped += 1
                print(f"[WARN] Skipping offer without id or url. Keys: {sorted(item.keys())}")
                continue
            inserted += save_raw(conn, item)

    duplicates = len(items) - inserted - skipped
    print(f"Fetched {len(items)} items, inserted {inserted} new, "
          f"{duplicates} duplicates, {skipped} skipped (missing id and url)")

if __name__ == "__main__":
    fetch_all()