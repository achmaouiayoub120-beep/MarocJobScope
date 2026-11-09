const DAY_MS = 86_400_000;

export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function timeAgo(iso: string, referenceIso: string): string {
  const date = new Date(iso);
  const reference = new Date(referenceIso);
  const dateDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const referenceDay = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  );
  const days = Math.max(0, Math.round((referenceDay - dateDay) / DAY_MS));
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} j`;
}

export function formatSalary(
  min: number,
  max: number,
  currency: string,
): string {
  return `${new Intl.NumberFormat("fr-FR").format(min)} – ${new Intl.NumberFormat(
    "fr-FR",
  ).format(max)} ${currency} / mois`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function companyGradient(name: string): string {
  const hue = hashString(name) % 360;
  return `linear-gradient(135deg, hsl(${hue} 52% 46%), hsl(${
    (hue + 44) % 360
  } 58% 28%))`;
}

export interface Tone {
  color: string;
  background: string;
  border: string;
}

const TONES: Tone[] = [
  {
    color: "#E9A93B",
    background: "rgba(233, 169, 59, 0.12)",
    border: "rgba(233, 169, 59, 0.32)",
  },
  {
    color: "#C7BFFF",
    background: "rgba(96, 80, 220, 0.16)",
    border: "rgba(96, 80, 220, 0.38)",
  },
  {
    color: "#EFAF95",
    background: "rgba(200, 96, 60, 0.14)",
    border: "rgba(200, 96, 60, 0.34)",
  },
  {
    color: "#E8DCC4",
    background: "rgba(232, 220, 196, 0.08)",
    border: "rgba(232, 220, 196, 0.2)",
  },
];

export function sectorTone(sector: string): Tone {
  return TONES[hashString(sector) % TONES.length];
}
