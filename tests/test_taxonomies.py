from db.taxonomies.loader import (
    load_cities,
    load_vocabularies,
    load_vocabulary_metadata,
)

EXPECTED_CITY_SLUGS = {
    "casablanca",
    "rabat",
    "marrakech",
    "tanger",
    "fes",
    "agadir",
    "meknes",
    "oujda",
    "kenitra",
    "tetouan",
    "sale",
    "el_jadida",
}

VOCABULARY_KEYS = {
    "contract_types",
    "experience_levels",
    "study_levels",
    "work_modes",
    "sectors",
    "functions",
}

ENUM_KEYS = {
    "contract_types",
    "experience_levels",
    "study_levels",
    "work_modes",
}


def test_cities_are_complete_and_unique():
    cities = load_cities()

    assert len(cities) == 12
    assert {city["slug"] for city in cities} == EXPECTED_CITY_SLUGS
    assert len({city["slug"] for city in cities}) == len(cities)


def test_city_required_fields_and_bounds():
    cities = load_cities()

    for city in cities:
        assert city["region"]
        assert city["names"]["fr"]
        assert city["names"]["en"]
        assert city["names"]["ar"]
        assert city["aliases"]
        assert 26.0 <= city["lat"] <= 36.5
        assert -14.0 <= city["lng"] <= -0.5


def test_vocabulary_categories_and_slugs():
    vocabularies = load_vocabularies()

    assert set(vocabularies) == VOCABULARY_KEYS

    for category, items in vocabularies.items():
        slugs = [item["slug"] for item in items]
        assert len(slugs) == len(set(slugs)), f"duplicate slug in {category}"
        for item in items:
            assert item["slug"]
            assert item["label_fr"]
            assert item["label_en"]


def test_sectors_and_functions_are_marked_provisional():
    metadata = load_vocabulary_metadata()

    assert set(metadata["provisional_categories"]) == {"sectors", "functions"}


def test_enums_have_unknown_fallback():
    vocabularies = load_vocabularies()

    for category in ENUM_KEYS:
        slugs = {item["slug"] for item in vocabularies[category]}
        assert "inconnu" in slugs, f"{category} must define 'inconnu'"


def test_experience_levels_are_ordered():
    levels = load_vocabularies()["experience_levels"]
    known = [level for level in levels if level["slug"] != "inconnu"]

    assert known == sorted(known, key=lambda level: level["min_years"])
    assert known[0]["min_years"] == 0
    assert known[-1]["max_years"] is None
