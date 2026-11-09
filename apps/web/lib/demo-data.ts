export const DEMO_SEED = 42;
export const DEMO_REFERENCE_DATE = "2026-11-09T12:00:00.000Z";
export const DEMO_WINDOW_DAYS = 90;
export const DEMO_OFFER_COUNT = 300;

export const DATA_DISCLAIMER =
  "Données de démonstration — offres, entreprises et chiffres fictifs.";

export type ContractType = "CDI" | "CDD" | "Stage" | "Freelance" | "Alternance";
export type ExperienceLevel =
  | "Débutant"
  | "Junior"
  | "Confirmé"
  | "Senior"
  | "Lead";
export type WorkMode = "Sur site" | "Hybride" | "Télétravail";

export interface CityDefinition {
  name: string;
  lat: number;
  lng: number;
  weight: number;
}

export interface DemoSource {
  id: string;
  label: string;
}

export interface SectorDefinition {
  name: string;
  weight: number;
  functions: string[];
  titles: string[];
  skills: string[];
  missions: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  lat: number;
  lng: number;
  sector: string;
  function: string;
  contract: ContractType;
  experience: ExperienceLevel;
  workMode: WorkMode;
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  currency: "MAD";
  publishedAt: string;
  expiresAt: string;
  description: string;
  skills: string[];
  sourceId: string;
  sourceLabel: string;
  isActive: boolean;
  isDemo: true;
}

export const CITIES: readonly CityDefinition[] = [
  { name: "Casablanca", lat: 33.5731, lng: -7.5898, weight: 22 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416, weight: 15 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811, weight: 10 },
  { name: "Tanger", lat: 35.7595, lng: -5.834, weight: 9 },
  { name: "Fès", lat: 34.0331, lng: -5.0003, weight: 8 },
  { name: "Agadir", lat: 30.4278, lng: -9.5981, weight: 7 },
  { name: "Meknès", lat: 33.8935, lng: -5.5473, weight: 5 },
  { name: "Oujda", lat: 34.6814, lng: -1.9086, weight: 5 },
  { name: "Kénitra", lat: 34.261, lng: -6.5802, weight: 5 },
  { name: "Tétouan", lat: 35.5785, lng: -5.3684, weight: 4 },
  { name: "Salé", lat: 34.0531, lng: -6.7985, weight: 5 },
  { name: "El Jadida", lat: 33.2549, lng: -8.506, weight: 5 },
];

export const SOURCES: readonly DemoSource[] = [
  { id: "demo_atlas", label: "Atlas Talents (démo)" },
  { id: "demo_souk", label: "Souk Emploi (démo)" },
  { id: "demo_medina", label: "Médina Careers (démo)" },
  { id: "demo_oasis", label: "Oasis Jobs (démo)" },
];

export const SECTORS: readonly SectorDefinition[] = [
  {
    name: "Informatique & Digital",
    weight: 18,
    functions: [
      "Développement logiciel",
      "Data & IA",
      "Infrastructure",
      "Produit",
    ],
    titles: [
      "Développeur Full Stack",
      "Data Analyst",
      "Ingénieur DevOps",
      "Product Designer",
      "Ingénieur QA",
    ],
    skills: [
      "React",
      "TypeScript",
      "Python",
      "SQL",
      "Docker",
      "AWS",
      "Git",
      "Node.js",
      "PostgreSQL",
      "CI/CD",
    ],
    missions: [
      "concevoir des interfaces web accessibles",
      "industrialiser les déploiements",
      "fiabiliser les pipelines de données",
      "accompagner la migration vers le cloud",
      "améliorer la performance des applications",
    ],
  },
  {
    name: "Finance & Banque",
    weight: 12,
    functions: ["Finance", "Analyse", "Relation client", "Audit"],
    titles: [
      "Analyste financier",
      "Contrôleur de gestion",
      "Chargé de clientèle",
      "Risk Analyst",
      "Trésorier",
    ],
    skills: [
      "Excel",
      "SQL",
      "Power BI",
      "IFRS",
      "Modélisation financière",
      "Risk Management",
      "VBA",
      "Contrôle budgétaire",
      "Reporting",
      "Bloomberg",
    ],
    missions: [
      "produire les reportings mensuels",
      "analyser les risques de crédit",
      "optimiser le pilotage budgétaire",
      "accompagner les clients professionnels",
      "automatiser les contrôles financiers",
    ],
  },
  {
    name: "Santé & Pharma",
    weight: 8,
    functions: [
      "Qualité",
      "Affaires réglementaires",
      "Recherche clinique",
      "Commercial",
    ],
    titles: [
      "Chargé de pharmacovigilance",
      "Coordinateur santé",
      "Technicien laboratoire",
      "Délégué médical",
      "Data Manager clinique",
    ],
    skills: [
      "Pharmacovigilance",
      "GMP",
      "Excel",
      "SAS",
      "Réglementation",
      "Qualité",
      "Communication scientifique",
      "Gestion de projet",
      "Clinical Data",
      "ISO 13485",
    ],
    missions: [
      "suivre les dossiers réglementaires",
      "coordonner les essais cliniques",
      "garantir la conformité qualité",
      "analyser les données de sécurité",
      "former les équipes terrain",
    ],
  },
  {
    name: "Industrie",
    weight: 10,
    functions: ["Production", "Maintenance", "Qualité", "Supply Chain"],
    titles: [
      "Ingénieur production",
      "Responsable maintenance",
      "Ingénieur qualité",
      "Supply Chain Analyst",
      "Technicien méthodes",
    ],
    skills: [
      "Lean",
      "Six Sigma",
      "AutoCAD",
      "SAP",
      "Gestion de production",
      "Qualité",
      "Maintenance industrielle",
      "Excel",
      "Supply Chain",
      "HSE",
    ],
    missions: [
      "améliorer les lignes de production",
      "piloter la maintenance préventive",
      "réduire les non-conformités",
      "optimiser les flux atelier",
      "déployer les standards HSE",
    ],
  },
  {
    name: "Commerce & Distribution",
    weight: 11,
    functions: ["Ventes", "Management", "Marketing", "Opérations"],
    titles: [
      "Responsable de magasin",
      "Chef de secteur",
      "Commercial terrain",
      "Category Manager",
      "Conseiller de vente",
    ],
    skills: [
      "Négociation",
      "CRM",
      "Excel",
      "Gestion de stock",
      "Merchandising",
      "Relation client",
      "Salesforce",
      "Analyse des ventes",
      "Management",
      "Animation d'équipe",
    ],
    missions: [
      "développer le chiffre d'affaires",
      "animer les équipes de vente",
      "optimiser les assortiments",
      "suivre les objectifs commerciaux",
      "fidéliser le réseau de partenaires",
    ],
  },
  {
    name: "Marketing & Communication",
    weight: 9,
    functions: ["Marketing", "Communication", "Digital", "Produit"],
    titles: [
      "Chargé de communication",
      "Social Media Manager",
      "Brand Manager",
      "Traffic Manager",
      "Content Strategist",
    ],
    skills: [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Content",
      "Canva",
      "Analytics",
      "CRM",
      "Copywriting",
      "Marketing automation",
      "Branding",
    ],
    missions: [
      "orchestrer les campagnes digitales",
      "produire des contenus bilingues",
      "suivre les performances acquisition",
      "renforcer la marque employeur",
      "coordonner les agences créatives",
    ],
  },
  {
    name: "Logistique & Transport",
    weight: 8,
    functions: ["Logistique", "Opérations", "Supply Chain", "Transport"],
    titles: [
      "Responsable logistique",
      "Coordinateur transport",
      "Gestionnaire d'entrepôt",
      "Supply Planner",
      "Agent douane",
    ],
    skills: [
      "SAP",
      "WMS",
      "Excel",
      "Gestion de stock",
      "Transport",
      "Douane",
      "Lean",
      "Supply Chain",
      "Incoterms",
      "Planification",
    ],
    missions: [
      "optimiser les tournées de livraison",
      "piloter les stocks entrepôt",
      "sécuriser les opérations douanières",
      "réduire les coûts logistiques",
      "améliorer le taux de service",
    ],
  },
  {
    name: "Éducation & Formation",
    weight: 5,
    functions: ["Formation", "Pédagogie", "Conseil", "Opérations"],
    titles: [
      "Formateur développement web",
      "Coordinateur pédagogique",
      "Ingénieur pédagogique",
      "Conseiller formation",
      "Enseignant vacataire",
    ],
    skills: [
      "Pédagogie",
      "Conception de formation",
      "LMS",
      "Communication",
      "Excel",
      "Gestion de projet",
      "Animation",
      "Évaluation",
      "Digital learning",
      "Français",
    ],
    missions: [
      "concevoir des parcours de formation",
      "animer des ateliers pratiques",
      "évaluer les acquis",
      "accompagner les apprenants",
      "digitaliser les supports pédagogiques",
    ],
  },
  {
    name: "BTP & Construction",
    weight: 7,
    functions: ["Travaux", "Études", "Ingénierie", "HSE"],
    titles: [
      "Conducteur de travaux",
      "Ingénieur BTP",
      "Architecte",
      "Métreur",
      "Chef de chantier",
    ],
    skills: [
      "AutoCAD",
      "Revit",
      "Gestion de chantier",
      "HSE",
      "Excel",
      "Métré",
      "Planification",
      "BIM",
      "Béton armé",
      "Suivi budgétaire",
    ],
    missions: [
      "piloter les chantiers",
      "suivre les études techniques",
      "garantir la sécurité sur site",
      "coordonner les corps d'état",
      "maîtriser les délais et budgets",
    ],
  },
  {
    name: "Tourisme & Hôtellerie",
    weight: 6,
    functions: ["Opérations", "Ventes", "Management", "Relation client"],
    titles: [
      "Responsable hébergement",
      "Chef de réception",
      "Revenue Manager",
      "Commercial groupe",
      "Concierge",
    ],
    skills: [
      "Relation client",
      "Anglais",
      "Excel",
      "Revenue Management",
      "Réservation",
      "Management",
      "Communication",
      "Français",
      "Espagnol",
      "Expérience client",
    ],
    missions: [
      "améliorer l'expérience client",
      "optimiser le taux d'occupation",
      "développer la clientèle internationale",
      "coordonner les équipes de réception",
      "piloter la stratégie tarifaire",
    ],
  },
  {
    name: "Énergie & Environnement",
    weight: 3,
    functions: ["Ingénierie", "Environnement", "Gestion de projet", "QHSE"],
    titles: [
      "Ingénieur énergies renouvelables",
      "Chef de projet environnement",
      "Analyste carbone",
      "Technicien solaire",
      "Responsable QHSE",
    ],
    skills: [
      "Photovoltaïque",
      "Audit énergétique",
      "Excel",
      "HSE",
      "Gestion de projet",
      "ISO 14001",
      "Analyse de cycle de vie",
      "AutoCAD",
      "Reporting",
      "Réglementation",
    ],
    missions: [
      "dimensionner des installations solaires",
      "piloter les études d'impact",
      "mesurer l'empreinte carbone",
      "déployer les normes environnementales",
      "accompagner la transition énergétique",
    ],
  },
  {
    name: "Télécoms",
    weight: 3,
    functions: ["Réseaux", "Data & IA", "Opérations", "Ingénierie"],
    titles: [
      "Ingénieur réseaux",
      "Data Engineer télécom",
      "Responsable déploiement",
      "Technicien fibre",
      "Analyste QoS",
    ],
    skills: [
      "Réseaux",
      "Fibre optique",
      "Python",
      "SQL",
      "5G",
      "Cisco",
      "Linux",
      "Monitoring",
      "Data Engineering",
      "Gestion de projet",
    ],
    missions: [
      "superviser les infrastructures réseau",
      "optimiser la qualité de service",
      "piloter les déploiements fibre",
      "automatiser le monitoring",
      "analyser les données réseau",
    ],
  },
];

export const COMPANIES: readonly string[] = [
  "Atlas Nova",
  "Kasbah Tech",
  "Zellige Labs",
  "Sahara Digital",
  "Majorelle Consulting",
  "Anfa Systems",
  "Rif Analytics",
  "Dunes & Data",
  "Oasis Santé",
  "Médina Logistics",
  "Souk Finance",
  "Tanger Code",
  "Rabat Cloud",
  "Marrakech Green",
  "Fès Métiers",
  "Agadir Blue",
  "Meknès Industrie",
  "Oujda Connect",
  "Kénitra Motion",
  "Tétouan Studio",
  "Salé Ventures",
  "El Jadida Solar",
  "Cèdre Conseil",
  "Aurora Retail",
  "Boussole RH",
  "Zellige Assurance",
  "Argan Media",
  "Menara Learning",
  "Bouregreg Énergie",
  "Détroit Hôtellerie",
];

const CONTRACTS: readonly ContractType[] = [
  "CDI",
  "CDI",
  "CDI",
  "CDI",
  "CDI",
  "CDD",
  "CDD",
  "Stage",
  "Freelance",
  "Alternance",
];

const EXPERIENCES: readonly ExperienceLevel[] = [
  "Débutant",
  "Junior",
  "Junior",
  "Junior",
  "Confirmé",
  "Confirmé",
  "Confirmé",
  "Senior",
  "Senior",
  "Lead",
];

const SALARY_BANDS: Record<ExperienceLevel, [number, number]> = {
  Débutant: [6000, 9000],
  Junior: [8000, 12000],
  Confirmé: [11000, 17000],
  Senior: [16000, 24000],
  Lead: [22000, 32000],
};

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick<T extends { weight: number }>(
  items: readonly T[],
  random: () => number,
): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let ticket = random() * total;
  for (const item of items) {
    ticket -= item.weight;
    if (ticket <= 0) {
      return item;
    }
  }
  return items[items.length - 1];
}

function pickOne<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function pickUnique<T>(
  items: readonly T[],
  count: number,
  random: () => number,
): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function roundTo500(value: number): number {
  return Math.round(value / 500) * 500;
}

function buildDescription(
  job: Pick<
    Job,
    | "title"
    | "company"
    | "city"
    | "sector"
    | "function"
    | "contract"
    | "experience"
    | "workMode"
    | "skills"
  >,
  missions: string[],
): string {
  const contractNote =
    job.contract === "Stage"
      ? "Stage de six mois, gratification selon profil."
      : job.contract === "Freelance"
        ? "Mission freelance de trois à six mois, TJM selon profil."
        : job.contract === "Alternance"
          ? "Contrat d'alternance de douze à vingt-quatre mois."
          : `Contrat ${job.contract}, prise de poste rapide.`;

  return [
    `${job.company} recherche un(e) ${job.title} à ${job.city} pour renforcer son équipe ${job.function.toLowerCase()}.`,
    `Missions principales : ${missions.join(", ")}.`,
    `Profil recherché : niveau ${job.experience}, à l'aise avec ${job.skills
      .slice(0, 3)
      .join(", ")}. ${contractNote} Poste basé à ${job.city} (${job.workMode.toLowerCase()}).`,
    "Offre fictive générée pour la démonstration MarocJobScope — aucune entreprise réelle n'est associée à cette annonce.",
  ].join("\n\n");
}

function buildJobs(): Job[] {
  const random = mulberry32(DEMO_SEED);
  const reference = new Date(DEMO_REFERENCE_DATE);
  const dayMs = 86_400_000;
  const jobs: Job[] = [];

  for (let index = 0; index < DEMO_OFFER_COUNT; index += 1) {
    const isSeeded = index < CITIES.length;
    const city = isSeeded ? CITIES[index] : weightedPick(CITIES, random);
    const sector = isSeeded ? SECTORS[index] : weightedPick(SECTORS, random);
    const company = isSeeded
      ? COMPANIES[index]
      : pickOne(COMPANIES, random);
    const title = pickOne(sector.titles, random);
    const jobFunction = pickOne(sector.functions, random);
    const contract = pickOne(CONTRACTS, random);
    const experience = pickOne(EXPERIENCES, random);
    const workModeRoll = random();
    const workMode: WorkMode =
      workModeRoll < 0.14
        ? "Télétravail"
        : workModeRoll < 0.38
          ? "Hybride"
          : "Sur site";
    const skillCount = 3 + Math.floor(random() * 3);
    const jobSkills = pickUnique(sector.skills, skillCount, random);
    const missionCount = 2 + Math.floor(random() * 2);
    const missions = pickUnique(sector.missions, missionCount, random);
    const source = pickOne(SOURCES, random);
    const daysAgo = Math.floor(random() * DEMO_WINDOW_DAYS);
    const published = new Date(
      reference.getTime() - daysAgo * dayMs - Math.floor(random() * dayMs),
    );
    const expires = new Date(published.getTime() + 60 * dayMs);
    const band =
      contract === "Stage" ? ([2500, 5500] as const) : SALARY_BANDS[experience];
    const salaryMin = roundTo500(band[0] + random() * 1500);
    const salaryMax = roundTo500(
      Math.max(salaryMin + 1500, band[1] + random() * 4000),
    );

    const jobBase = {
      title,
      company,
      city: city.name,
      sector: sector.name,
      function: jobFunction,
      contract,
      experience,
      workMode,
      skills: jobSkills,
    };

    jobs.push({
      id: `demo-${String(index + 1).padStart(4, "0")}`,
      title,
      company,
      city: city.name,
      lat: city.lat,
      lng: city.lng,
      sector: sector.name,
      function: jobFunction,
      contract,
      experience,
      workMode,
      remote: workMode !== "Sur site",
      salaryMin,
      salaryMax,
      currency: "MAD",
      publishedAt: published.toISOString(),
      expiresAt: expires.toISOString(),
      description: buildDescription(jobBase, missions),
      skills: jobSkills,
      sourceId: source.id,
      sourceLabel: source.label,
      isActive: true,
      isDemo: true,
    });
  }

  return jobs;
}

export const JOBS: readonly Job[] = buildJobs();
