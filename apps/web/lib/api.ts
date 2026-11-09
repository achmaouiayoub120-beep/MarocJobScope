import {
  CITIES,
  DEMO_OFFER_COUNT,
  DEMO_REFERENCE_DATE,
  DEMO_WINDOW_DAYS,
  JOBS,
  SECTORS,
  SOURCES,
} from "./demo-data";
import type { Job } from "./demo-data";

export { DATA_DISCLAIMER, DEMO_REFERENCE_DATE } from "./demo-data";
export type {
  ContractType,
  ExperienceLevel,
  Job,
  WorkMode,
} from "./demo-data";

const DAY_MS = 86_400_000;
const REFERENCE_MS = Date.parse(DEMO_REFERENCE_DATE);
const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export type SortKey = "pertinence" | "recent" | "entreprise";

export interface CityStat {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

export interface SectorStat {
  name: string;
  count: number;
}

export interface SkillStat {
  name: string;
  count: number;
}

export interface SourceStat {
  id: string;
  label: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  label: string;
  count: number;
  average: number;
}

export interface Overview {
  mode: "demo";
  isDemo: true;
  referenceDate: string;
  windowDays: number;
  activeJobs: number;
  newLast7Days: number;
  companies: number;
  cityCount: number;
  cities: CityStat[];
  trend: TrendPoint[];
  topSectors: SectorStat[];
  topSkills: SkillStat[];
  sources: SourceStat[];
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facets {
  cities: FacetOption[];
  sectors: FacetOption[];
  contracts: FacetOption[];
  experiences: FacetOption[];
  sources: FacetOption[];
}

export interface SearchJobsParams {
  q?: string;
  city?: string;
  sector?: string;
  contract?: string;
  experience?: string;
  source?: string;
  sort?: SortKey;
  limit?: number;
}

export interface SearchResult {
  items: Job[];
  total: number;
  limit: number;
  hasMore: boolean;
  referenceDate: string;
}

export interface JobDetail {
  job: Job;
  similar: Job[];
}

export interface DemoMeta {
  mode: "demo";
  isDemo: true;
  referenceDate: string;
  windowDays: number;
  offerCount: number;
  sourceCount: number;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatTrendLabel(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")} ${
    MONTHS[date.getUTCMonth()]
  }`;
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function sortFacetOptions(options: FacetOption[]): FacetOption[] {
  return options.sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, "fr"),
  );
}

function relevanceScore(job: Job, query: string): number {
  if (!query) {
    return 0;
  }
  const title = normalize(job.title);
  const company = normalize(job.company);
  const description = normalize(job.description);
  const skills = job.skills.map(normalize);
  const context = normalize(
    `${job.city} ${job.sector} ${job.function} ${job.contract} ${job.experience}`,
  );

  let score = 0;
  if (title === query) score += 12;
  else if (title.startsWith(query)) score += 8;
  else if (title.includes(query)) score += 6;
  if (company.includes(query)) score += 4;
  if (skills.some((skill) => skill.includes(query))) score += 3;
  if (context.includes(query)) score += 2;
  if (description.includes(query)) score += 1;
  return score;
}

function sortJobs(jobs: Job[], sort: SortKey, query: string): Job[] {
  return [...jobs].sort((a, b) => {
    if (sort === "entreprise") {
      return (
        a.company.localeCompare(b.company, "fr") ||
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
      );
    }
    if (sort === "pertinence" && query) {
      const scoreDiff =
        relevanceScore(b, query) - relevanceScore(a, query);
      if (scoreDiff !== 0) return scoreDiff;
    }
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  });
}

export async function getMeta(): Promise<DemoMeta> {
  await wait(80);
  return {
    mode: "demo",
    isDemo: true,
    referenceDate: DEMO_REFERENCE_DATE,
    windowDays: DEMO_WINDOW_DAYS,
    offerCount: DEMO_OFFER_COUNT,
    sourceCount: SOURCES.length,
  };
}

export async function getOverview(): Promise<Overview> {
  await wait(140);

  const startMs = REFERENCE_MS - DEMO_WINDOW_DAYS * DAY_MS;
  const buckets = Array.from({ length: DEMO_WINDOW_DAYS }, () => 0);
  for (const job of JOBS) {
    const index = Math.floor(
      (Date.parse(job.publishedAt) - startMs) / DAY_MS,
    );
    if (index >= 0 && index < DEMO_WINDOW_DAYS) {
      buckets[index] += 1;
    }
  }

  const trend: TrendPoint[] = buckets.map((count, index) => {
    const date = new Date(startMs + index * DAY_MS);
    const window = buckets.slice(Math.max(0, index - 6), index + 1);
    const average =
      window.reduce((sum, value) => sum + value, 0) / window.length;
    return {
      date: date.toISOString().slice(0, 10),
      label: formatTrendLabel(date),
      count,
      average: Number(average.toFixed(2)),
    };
  });

  const cityCounts = countBy(JOBS.map((job) => job.city));
  const cities: CityStat[] = CITIES.map((city) => ({
    name: city.name,
    lat: city.lat,
    lng: city.lng,
    count: cityCounts.get(city.name) ?? 0,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));

  const sectorCounts = countBy(JOBS.map((job) => job.sector));
  const topSectors: SectorStat[] = SECTORS.map((sector) => ({
    name: sector.name,
    count: sectorCounts.get(sector.name) ?? 0,
  }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"))
    .slice(0, 6);

  const skillCounts = countBy(JOBS.flatMap((job) => job.skills));
  const topSkills: SkillStat[] = [...skillCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"))
    .slice(0, 10);

  const sourceCounts = countBy(JOBS.map((job) => job.sourceId));
  const sources: SourceStat[] = SOURCES.map((source) => ({
    id: source.id,
    label: source.label,
    count: sourceCounts.get(source.id) ?? 0,
  }));

  return {
    mode: "demo",
    isDemo: true,
    referenceDate: DEMO_REFERENCE_DATE,
    windowDays: DEMO_WINDOW_DAYS,
    activeJobs: JOBS.length,
    newLast7Days: JOBS.filter(
      (job) => Date.parse(job.publishedAt) >= REFERENCE_MS - 7 * DAY_MS,
    ).length,
    companies: new Set(JOBS.map((job) => job.company)).size,
    cityCount: cities.filter((city) => city.count > 0).length,
    cities,
    trend,
    topSectors,
    topSkills,
    sources,
  };
}

export async function getFacets(): Promise<Facets> {
  await wait(110);

  const cityCounts = countBy(JOBS.map((job) => job.city));
  const sectorCounts = countBy(JOBS.map((job) => job.sector));
  const contractCounts = countBy(JOBS.map((job) => job.contract));
  const experienceCounts = countBy(JOBS.map((job) => job.experience));
  const sourceCounts = countBy(JOBS.map((job) => job.sourceId));

  return {
    cities: sortFacetOptions(
      CITIES.map((city) => ({
        value: city.name,
        label: city.name,
        count: cityCounts.get(city.name) ?? 0,
      })),
    ),
    sectors: sortFacetOptions(
      SECTORS.map((sector) => ({
        value: sector.name,
        label: sector.name,
        count: sectorCounts.get(sector.name) ?? 0,
      })),
    ),
    contracts: sortFacetOptions(
      ["CDI", "CDD", "Stage", "Freelance", "Alternance"].map((contract) => ({
        value: contract,
        label: contract,
        count: contractCounts.get(contract) ?? 0,
      })),
    ),
    experiences: sortFacetOptions(
      ["Débutant", "Junior", "Confirmé", "Senior", "Lead"].map(
        (experience) => ({
          value: experience,
          label: experience,
          count: experienceCounts.get(experience) ?? 0,
        }),
      ),
    ),
    sources: sortFacetOptions(
      SOURCES.map((source) => ({
        value: source.id,
        label: source.label,
        count: sourceCounts.get(source.id) ?? 0,
      })),
    ),
  };
}

export async function searchJobs(
  params: SearchJobsParams = {},
): Promise<SearchResult> {
  await wait(180);

  const query = normalize(params.q?.trim() ?? "");
  const limit = Math.min(300, Math.max(12, params.limit ?? 12));
  const sort = params.sort ?? "pertinence";

  const filtered = JOBS.filter((job) => {
    if (params.city && job.city !== params.city) return false;
    if (params.sector && job.sector !== params.sector) return false;
    if (params.contract && job.contract !== params.contract) return false;
    if (params.experience && job.experience !== params.experience) return false;
    if (params.source && job.sourceId !== params.source) return false;
    if (!query) return true;
    return relevanceScore(job, query) > 0;
  });

  const sorted = sortJobs(filtered, sort, query);

  return {
    items: sorted.slice(0, limit),
    total: sorted.length,
    limit,
    hasMore: sorted.length > limit,
    referenceDate: DEMO_REFERENCE_DATE,
  };
}

export async function getJob(id: string): Promise<JobDetail | null> {
  await wait(120);

  const job = JOBS.find((candidate) => candidate.id === id);
  if (!job) {
    return null;
  }

  const similar = JOBS.filter((candidate) => candidate.id !== job.id)
    .map((candidate) => {
      const sharedSkills = candidate.skills.filter((skill) =>
        job.skills.includes(skill),
      ).length;
      const score =
        (candidate.sector === job.sector ? 3 : 0) +
        (candidate.city === job.city ? 1.5 : 0) +
        (candidate.contract === job.contract ? 0.3 : 0) +
        sharedSkills * 0.4;
      return { candidate, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.candidate.publishedAt) -
          Date.parse(a.candidate.publishedAt),
    )
    .slice(0, 3)
    .map(({ candidate }) => candidate);

  return { job, similar };
}
