import { AnimatedCounter } from "@/components/animated-counter";
import { Reveal } from "@/components/reveal";

type KpiIcon = "briefcase" | "sparkles" | "building" | "map";

const ACCENTS: Record<
  string,
  { color: string; background: string; line: string }
> = {
  safran: {
    color: "#E9A93B",
    background: "rgba(233, 169, 59, 0.12)",
    line: "from-safran/70",
  },
  majorelle: {
    color: "#B9B0FF",
    background: "rgba(96, 80, 220, 0.18)",
    line: "from-majorelle/70",
  },
  terracotta: {
    color: "#EFAF95",
    background: "rgba(200, 96, 60, 0.14)",
    line: "from-terracotta/70",
  },
  sand: {
    color: "#E8DCC4",
    background: "rgba(232, 220, 196, 0.08)",
    line: "from-sand/50",
  },
};

function Icon({ name }: { name: KpiIcon }) {
  if (name === "sparkles") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 14.5 19.4 17l2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "building") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M4 20V6.8L12 3l8 3.8V20M4 20h16M8.5 20v-4h7v4M8 9h.01M12 9h.01M16 9h.01M8 12.5h.01M12 12.5h.01M16 12.5h.01"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "map") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M12 21s6.5-5.4 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7M4.8 7h14.4A1.8 1.8 0 0 1 21 8.8v9.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 18.2V8.8A1.8 1.8 0 0 1 4.8 7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M3 11.5h18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  caption,
  icon,
  accent = "safran",
  delay = 0,
}: {
  label: string;
  value: number;
  caption: string;
  icon: KpiIcon;
  accent?: keyof typeof ACCENTS;
  delay?: number;
}) {
  const tone = ACCENTS[accent];

  return (
    <Reveal delay={delay}>
      <div className="glass group relative overflow-hidden rounded-2xl p-4 sm:p-5">
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${tone.line} to-transparent`}
        />
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-medium uppercase leading-relaxed tracking-[0.16em] text-sand/50 sm:text-[11px]">
            {label}
          </p>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
            style={{
              color: tone.color,
              background: tone.background,
              borderColor: tone.background,
            }}
          >
            <Icon name={icon} />
          </span>
        </div>
        <p className="mt-4 font-mono text-3xl font-semibold tracking-tight text-sand tabular sm:text-4xl">
          <AnimatedCounter value={value} />
        </p>
        <p className="mt-2 text-[11px] leading-snug text-sand/40">{caption}</p>
      </div>
    </Reveal>
  );
}
