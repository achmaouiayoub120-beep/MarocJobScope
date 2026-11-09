"""Deterministic demo dataset for raw.job_postings (test database only).

Every generated row is marked with a demo_* source and a demo.invalid URL.
The script refuses to run against any database other than marocjobscope_test.

Usage:
    python -m db.seeds.demo --count 2000 --seed 42
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import bindparam, text

from db.connection import engine

ALLOWED_DB = "marocjobscope_test"
DEMO_SOURCES = ("demo_rekrute", "demo_careerjet", "demo_indeed", "demo_wadifa")


@dataclass(frozen=True)
class Role:
    title: str
    sector: str
    function: str
    skills: tuple[str, ...]
    salary_min: int
    salary_max: int
    weight: int = 10
    public: bool = False


ROLES: tuple[Role, ...] = (
    Role("Développeur web", "IT & Télécom", "Développement",
         ("JavaScript", "React", "Node.js", "HTML/CSS", "PHP", "Laravel", "Git"), 7000, 16000, 16),
    Role("Data Analyst", "IT & Télécom", "Data",
         ("SQL", "Python", "Power BI", "Excel", "Tableau"), 8000, 18000, 14),
    Role("Data Engineer", "IT & Télécom", "Data",
         ("Python", "SQL", "Spark", "Airflow", "PostgreSQL", "Docker"), 12000, 25000, 8),
    Role("Administrateur systèmes", "IT & Télécom", "Infrastructure",
         ("Linux", "Windows Server", "VMware", "Réseaux", "PowerShell"), 8000, 17000, 8),
    Role("Ingénieur DevOps", "IT & Télécom", "Infrastructure",
         ("Docker", "Kubernetes", "CI/CD", "Terraform", "AWS"), 13000, 26000, 6),
    Role("Technicien support informatique", "IT & Télécom", "Support IT",
         ("Windows", "Active Directory", "Réseaux", "Helpdesk"), 5000, 9000, 9, True),
    Role("Comptable", "Finance & Banque", "Finance/Comptabilité",
         ("Sage", "Excel", "Fiscalité", "Comptabilité générale"), 6000, 12000, 13),
    Role("Contrôleur de gestion", "Finance & Banque", "Finance/Comptabilité",
         ("Excel", "SAP", "Budget", "Reporting", "Power BI"), 10000, 20000, 7),
    Role("Auditeur financier", "Finance & Banque", "Audit/Contrôle",
         ("Audit", "IFRS", "Excel", "Gestion des risques"), 9000, 18000, 5),
    Role("Chargé de clientèle bancaire", "Finance & Banque", "Relation client",
         ("Relation client", "Vente", "Excel"), 5500, 10000, 8),
    Role("Commercial terrain", "Commerce & Distribution", "Ventes",
         ("Prospection", "Négociation", "CRM", "Vente"), 6000, 14000, 14),
    Role("Téléconseiller", "Services aux entreprises", "Relation client",
         ("Communication", "CRM", "Français", "Arabe"), 3500, 6000, 15),
    Role("Community Manager", "Marketing & Communication", "Marketing",
         ("Réseaux sociaux", "Canva", "SEO", "Copywriting"), 6000, 12000, 8),
    Role("Responsable marketing digital", "Marketing & Communication", "Marketing",
         ("SEO", "SEA", "Google Analytics", "Meta Ads", "CRM"), 10000, 20000, 6),
    Role("Chargé de recrutement", "Services aux entreprises", "Ressources humaines",
         ("Recrutement", "Sourcing", "Entretien", "ATS"), 6000, 12000, 7),
    Role("Juriste d'entreprise", "Services aux entreprises", "Juridique",
         ("Droit des affaires", "Contrats", "Droit social"), 8000, 16000, 4),
    Role("Responsable logistique", "Transport & Logistique", "Logistique/Achats",
         ("Supply chain", "SAP", "Gestion des stocks", "Excel"), 9000, 18000, 9),
    Role("Technicien de maintenance", "Industrie", "Production/Maintenance",
         ("Maintenance industrielle", "Électromécanique", "HSE", "Autocad"), 6000, 11000, 10, True),
    Role("Conducteur de travaux", "BTP & Construction", "Gestion de projet",
         ("Gestion de chantier", "Autocad", "Planification", "HSE"), 10000, 20000, 5),
    Role("Électricien", "Industrie", "Production/Maintenance",
         ("Électricité", "Normes", "Sécurité", "Lecture de plans"), 4500, 8000, 7, True),
    Role("Infirmier", "Santé", "Santé/Soins",
         ("Soins", "Urgences", "Français", "Arabe"), 6000, 11000, 9, True),
    Role("Enseignant", "Éducation & Formation", "Enseignement",
         ("Pédagogie", "Français", "Gestion de classe"), 6000, 12000, 8, True),
    Role("Réceptionniste d'hôtel", "Tourisme & Hôtellerie", "Relation client",
         ("Accueil", "Anglais", "Français", "PMS"), 4000, 7000, 6),
    Role("Agent administratif", "Administration publique", "Administration",
         ("Accueil", "Excel", "Rédaction", "Classement"), 4000, 7000, 7, True),
)

CITIES: tuple[tuple[str, str, int], ...] = (
    ("Casablanca", "Casablanca-Settat", 28),
    ("Rabat", "Rabat-Salé-Kénitra", 15),
    ("Marrakech", "Marrakech-Safi", 9),
    ("Tanger", "Tanger-Tétouan-Al Hoceïma", 9),
    ("Fès", "Fès-Meknès", 8),
    ("Agadir", "Souss-Massa", 7),
    ("Meknès", "Fès-Meknès", 5),
    ("Oujda", "Oriental", 4),
    ("Kénitra", "Rabat-Salé-Kénitra", 4),
    ("Tétouan", "Tanger-Tétouan-Al Hoceïma", 4),
    ("Salé", "Rabat-Salé-Kénitra", 4),
    ("El Jadida", "Casablanca-Settat", 3),
)

CONTRACTS = ("CDI", "CDD", "Stage", "Alternance", "Freelance", "Intérim")
CONTRACT_WEIGHTS = (45, 20, 12, 8, 6, 5)
EXPERIENCES = ("Débutant", "1-2 ans", "3-5 ans", "6-9 ans", "10 ans et +")
EXPERIENCE_WEIGHTS = (20, 28, 27, 17, 8)
STUDY_LEVELS = ("Sans diplôme", "Bac", "Bac+2", "Bac+3 (Licence)", "Bac+5 (Master)", "Doctorat")
STUDY_WEIGHTS = (4, 12, 28, 29, 23, 4)
WORK_MODES = ("Présentiel", "Hybride", "Télétravail")
WORK_MODE_WEIGHTS = (82, 10, 8)

COMPANY_PREFIXES = (
    "Atlas", "Nova", "Médina", "Anfa", "Zellige", "Sahara", "Bab", "Dar",
    "Majorelle", "Souss", "Tafilalt", "Rif", "Chaouia", "Doukkala", "Saïss",
    "Argan", "Kasbah", "Mellah", "Oasis", "Tamazight",
)
COMPANY_CORES = (
    "Tech", "Solutions", "Group", "Digital", "Industries", "Consulting",
    "Services", "Holding", "Labs", "Santé", "Logistique", "Finance",
    "Bâtiment", "Média", "Énergie", "Agro", "Transport", "Conseil",
)
COMPANY_LEGAL_FORMS = ("SARL", "SA", "SARL AU", "SAS")
PUBLIC_ORGANIZATIONS = (
    "Ministère de la Santé (démo)",
    "Ministère de l'Éducation Nationale (démo)",
    "Ministère de l'Intérieur (démo)",
    "Office public de l'emploi (démo)",
)

MISSIONS = (
    "analyser les besoins et proposer des solutions adaptées",
    "concevoir et mettre en œuvre les actions opérationnelles",
    "assurer le suivi des indicateurs et le reporting",
    "collaborer avec les équipes internes et les partenaires",
    "garantir la qualité, la conformité et le respect des délais",
    "participer à l'amélioration continue des processus",
)

INDEED_JOB_TYPES = {
    "CDI": "fulltime",
    "CDD": "contract",
    "Stage": "internship",
    "Alternance": "internship",
    "Freelance": "contract",
    "Intérim": "temporary",
    "Concours": "fulltime",
}


def build_companies(rng: random.Random, count: int = 140) -> tuple[str, ...]:
    companies: set[str] = set()
    while len(companies) < count:
        name = (
            f"{rng.choice(COMPANY_PREFIXES)} {rng.choice(COMPANY_CORES)} "
            f"{rng.choice(COMPANY_LEGAL_FORMS)}"
        )
        companies.add(name)
    return tuple(sorted(companies))


def weighted_pick(rng: random.Random, values, weights):
    return rng.choices(values, weights=weights, k=1)[0]


def salary_for_role(rng: random.Random, role: Role, experience: str) -> tuple[int, int]:
    factor = {
        "Débutant": 0.8,
        "1-2 ans": 1.0,
        "3-5 ans": 1.2,
        "6-9 ans": 1.4,
        "10 ans et +": 1.7,
    }[experience]
    low = int(round(role.salary_min * factor / 500.0) * 500)
    high = int(round(role.salary_max * factor / 500.0) * 500)
    return low, high


def make_description(
    rng: random.Random,
    role: Role,
    company: str,
    city: str,
    contract: str,
    experience: str,
    study: str,
    work_mode: str,
) -> str:
    missions = "; ".join(rng.sample(MISSIONS, k=3))
    skills = ", ".join(rng.sample(list(role.skills), k=min(4, len(role.skills))))
    remote_sentence = {
        "Présentiel": "Le poste est basé dans nos locaux.",
        "Hybride": "Le poste est organisé en mode hybride (présentiel et télétravail).",
        "Télétravail": "Le poste est éligible au télétravail.",
    }[work_mode]
    templates = (
        (
            "{company} recrute un(e) {title} à {city}. Missions principales : {missions}. "
            "Compétences recherchées : {skills}. Profil : expérience {experience}, "
            "niveau d'études {study}. Contrat : {contract}. {remote_sentence}"
        ),
        (
            "Nous recherchons un(e) {title} pour rejoindre {company} à {city}. "
            "Vous interviendrez sur : {missions}. Compétences attendues : {skills}. "
            "Expérience demandée : {experience}. Formation : {study}. Contrat proposé : "
            "{contract}. {remote_sentence}"
        ),
    )
    return rng.choice(templates).format(
        company=company,
        title=role.title,
        city=city,
        missions=missions,
        skills=skills,
        experience=experience,
        study=study,
        contract=contract,
        remote_sentence=remote_sentence,
    )


def build_payload(
    source: str,
    source_job_id: str,
    role: Role,
    company: str,
    city: str,
    region: str,
    contract: str,
    experience: str,
    study: str,
    work_mode: str,
    published: date,
    expires: date,
    salary: tuple[int, int] | None,
    description: str,
    rng: random.Random,
) -> dict:
    url = f"https://demo.invalid/{source}/{source_job_id}"

    if source == "demo_rekrute":
        return {
            "url": url,
            "source": source,
            "title": role.title,
            "company": company,
            "location": city,
            "date_published": published.strftime("%d/%m/%Y"),
            "date_expiration": expires.strftime("%d/%m/%Y"),
            "sector": role.sector,
            "function": role.function,
            "experience": experience,
            "study_level": study,
            "contract_type": contract,
            "remote": "Oui" if work_mode == "Télétravail" else ("Hybride" if work_mode == "Hybride" else "Non"),
            "positions_count": str(rng.randint(1, 4)),
            "description": description,
            "profile": (
                "Vous êtes rigoureux(se), autonome et appréciez le travail en équipe. "
                f"Une première expérience en {role.sector} est appréciée."
            ),
            "skills": ", ".join(rng.sample(list(role.skills), k=min(3, len(role.skills)))),
            "offer_id": source_job_id,
        }

    if source == "demo_careerjet":
        payload = {
            "title": role.title,
            "company": company,
            "locations": city,
            "date": published.isoformat(),
            "url": url,
            "description": description,
            "site": "demo-careerjet",
            "contract_type": contract,
            "work_mode": work_mode,
        }
        if salary:
            low, high = salary
            payload["salary"] = f"{low:,} - {high:,} MAD / mois".replace(",", " ")
        return payload

    if source == "demo_indeed":
        low, high = salary if salary else (None, None)
        return {
            "title": role.title,
            "company": company,
            "location": city,
            "job_type": INDEED_JOB_TYPES.get(contract, "fulltime"),
            "date_posted": published.isoformat(),
            "job_url": url,
            "description": description,
            "min_amount": low,
            "max_amount": high,
            "currency": "MAD" if salary else None,
            "interval": "monthly" if salary else None,
            "is_remote": work_mode == "Télétravail",
        }

    return {
        "id": source_job_id,
        "url": url,
        "title": role.title,
        "organization": company,
        "city": city,
        "region": region,
        "deadline": expires.isoformat(),
        "study_level": study,
        "description": description,
        "concours_type": "Concours public",
    }


def generate_rows(count: int, seed: int) -> list[dict]:
    rng = random.Random(seed)
    companies = build_companies(rng)
    role_weights = [role.weight for role in ROLES]
    city_values = [city for city, _, _ in CITIES]
    city_weights = [weight for _, _, weight in CITIES]
    public_roles = [role for role in ROLES if role.public]
    public_weights = [role.weight for role in public_roles]

    today = datetime.now(UTC).date()
    dedup_pool: list[dict] = []
    rows: list[dict] = []

    for index in range(1, count + 1):
        source = DEMO_SOURCES[(index - 1) % len(DEMO_SOURCES)]
        source_job_id = f"{source}-{index:06d}"

        reuse = dedup_pool and rng.random() < 0.08
        if reuse:
            base = rng.choice(dedup_pool)
            role = base["role"]
            company = base["company"]
            city = base["city"]
        else:
            if source == "demo_wadifa":
                role = weighted_pick(rng, public_roles, public_weights)
                company = rng.choice(PUBLIC_ORGANIZATIONS)
            else:
                role = weighted_pick(rng, ROLES, role_weights)
                company = rng.choice(companies)
            city = weighted_pick(rng, city_values, city_weights)

        region = next(region for name, region, _ in CITIES if name == city)

        if source == "demo_wadifa":
            contract = "Concours"
        else:
            contract = weighted_pick(rng, CONTRACTS, CONTRACT_WEIGHTS)

        experience = weighted_pick(rng, EXPERIENCES, EXPERIENCE_WEIGHTS)
        study = weighted_pick(rng, STUDY_LEVELS, STUDY_WEIGHTS)
        work_mode = weighted_pick(rng, WORK_MODES, WORK_MODE_WEIGHTS)

        salary_probability = 0.25 if contract in ("Stage", "Alternance") else 0.55
        salary = None
        if source != "demo_wadifa" and rng.random() < salary_probability:
            salary = salary_for_role(rng, role, experience)

        published = today - timedelta(days=rng.randint(0, 119))
        expires = published + timedelta(days=rng.randint(20, 60))

        description = make_description(
            rng, role, company, city, contract, experience, study, work_mode
        )

        payload = build_payload(
            source=source,
            source_job_id=source_job_id,
            role=role,
            company=company,
            city=city,
            region=region,
            contract=contract,
            experience=experience,
            study=study,
            work_mode=work_mode,
            published=published,
            expires=expires,
            salary=salary,
            description=description,
            rng=rng,
        )

        payload_json = json.dumps(payload, sort_keys=True, ensure_ascii=False)
        rows.append(
            {
                "source": source,
                "url": f"https://demo.invalid/{source}/{source_job_id}",
                "job_id": source_job_id,
                "payload": payload_json,
                "hash": hashlib.sha256(payload_json.encode("utf-8")).hexdigest(),
            }
        )

        if not reuse:
            dedup_pool.append({"role": role, "company": company, "city": city})

    return rows


def show_rows(result) -> None:
    keys = list(result.keys())
    print(" | ".join(keys))
    for row in result:
        print(" | ".join("" if value is None else str(value) for value in row))


def seed(count: int, seed_value: int) -> None:
    rows = generate_rows(count=count, seed=seed_value)

    insert_sql = text(
        """
        INSERT INTO raw.job_postings (source, source_url, source_job_id, payload, html_hash)
        VALUES (:source, :url, :job_id, CAST(:payload AS JSONB), :hash)
        """
    )

    with engine.begin() as conn:
        current_db = conn.execute(text("SELECT current_database();")).scalar()
        if current_db != ALLOWED_DB:
            raise SystemExit(
                f"Refusing to seed database '{current_db}'. "
                f"Only {ALLOWED_DB} is allowed."
            )

        table_exists = conn.execute(
            text("SELECT to_regclass('raw.job_postings')::text;")
        ).scalar()
        if table_exists is None:
            raise SystemExit(
                "raw.job_postings is missing. Run `python -m scripts.provision_test_db` first."
            )

        delete_sql = text(
            "DELETE FROM raw.job_postings WHERE source IN :sources"
        ).bindparams(bindparam("sources", expanding=True))
        deleted = conn.execute(delete_sql, {"sources": list(DEMO_SOURCES)}).rowcount
        if deleted is None:
            deleted = 0

        conn.execute(insert_sql, rows)

    print(f"Deleted previous demo rows: {deleted}")
    print(f"Inserted demo rows: {len(rows)}")

    print("\n=== SEED VERIFICATION (raw SQL output) ===")
    with engine.connect() as conn:
        show_rows(conn.execute(text("SELECT count(*) AS total FROM raw.job_postings;")))

        print("\n--- rows per source ---")
        show_rows(
            conn.execute(
                text(
                    """
                    SELECT source,
                           count(*) AS rows,
                           count(DISTINCT COALESCE(payload->>'company', payload->>'organization')) AS companies,
                           count(DISTINCT COALESCE(
                               NULLIF(payload->>'location', ''),
                               NULLIF(payload->>'locations', ''),
                               NULLIF(payload->>'city', '')
                           )) AS cities,
                           count(*) FILTER (WHERE length(btrim(html_hash)) = 64) AS hashes_len_64,
                           count(*) FILTER (
                               WHERE COALESCE(payload->>'url', payload->>'job_url')
                                     LIKE 'https://demo.invalid/%'
                           ) AS demo_urls,
                           min(ingested_at) AS first_ingest,
                           max(ingested_at) AS last_ingest
                    FROM raw.job_postings
                    GROUP BY source
                    ORDER BY source;
                    """
                )
            )
        )

        print("\n--- sample rows ---")
        show_rows(
            conn.execute(
                text(
                    """
                    SELECT source, source_job_id, payload->>'title' AS title
                    FROM raw.job_postings
                    ORDER BY id
                    LIMIT 8;
                    """
                )
            )
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed deterministic demo data.")
    parser.add_argument("--count", type=int, default=2000)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if args.count <= 0:
        raise SystemExit("--count must be positive.")

    seed(count=args.count, seed_value=args.seed)


if __name__ == "__main__":
    main()
