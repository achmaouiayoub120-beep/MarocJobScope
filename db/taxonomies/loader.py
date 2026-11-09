"""Load curated taxonomies from versioned YAML files."""

from pathlib import Path
from typing import Any

import yaml

TAXONOMY_DIR = Path(__file__).resolve().parent


def _load_yaml(filename: str) -> dict[str, Any]:
    path = TAXONOMY_DIR / filename
    with path.open(encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise TypeError(f"{filename} must contain a YAML mapping.")
    return data


def load_cities() -> list[dict[str, Any]]:
    return _load_yaml("cities.yml")["cities"]


def load_vocabularies() -> dict[str, list[dict[str, Any]]]:
    data = _load_yaml("vocabularies.yml")
    return {
        key: value
        for key, value in data.items()
        if key not in {"version", "metadata"}
    }


def load_vocabulary_metadata() -> dict[str, Any]:
    return _load_yaml("vocabularies.yml").get("metadata", {})
