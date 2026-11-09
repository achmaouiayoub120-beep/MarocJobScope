import Link from "next/link";

import type { Job } from "@/lib/api";
import {
  cn,
  companyGradient,
  formatSalary,
  initials,
  sectorTone,
  timeAgo,
} from "@/lib/format";

export function JobCard({
  job,
  referenceDate,
  className,
}: {
  job: Job;
  referenceDate: string;
  className?: string;
}) {
  const tone = sectorTone(job.sector);

  return (
    <article
      className={cn(
        "glass group relative flex h-full flex-col rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-sand/20 hover:bg-white/[0.05] sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 font-mono text-[11px] font-semibold text-white shadow-inner"
            style={{ background: companyGradient(job.company) }}
          >
            {initials(job.company)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-sand/70">
              {job.company}
            </p>
            <p className="mt-0.5 flex items-start gap-1 text-[11px] leading-snug text-sand/40">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="mt-px h-3 w-3 shrink-0"
              >
                <path
                  d="M8 14s4-3.2 4-6.8a4 4 0 1 0-8 0C4 10.8 8 14 8 14Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <circle cx="8" cy="7" r="1.2" fill="currentColor" />
              </svg>
              <span>
                {job.city} · {job.workMode}
              </span>
            </p>
          </div>
        </div>
        <span
          className="max-w-[46%] shrink-0 truncate rounded-full border px-2.5 py-1 text-[10px] font-medium"
          style={{
            color: tone.color,
            background: tone.background,
            borderColor: tone.border,
          }}
          title={job.sector}
        >
          {job.sector}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-sand">
        <Link
          href={`/offres/${job.id}`}
          className="transition hover:text-safran focus-visible:outline-none"
        >
          {job.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand/45">
        {job.description.split("\n\n")[0]}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
        {job.skills.length > 4 ? (
          <span className="chip">+{job.skills.length - 4}</span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] text-sand/45">
        <span className="rounded-full bg-white/[0.04] px-2 py-1">
          {job.contract}
        </span>
        <span className="rounded-full bg-white/[0.04] px-2 py-1">
          {job.experience}
        </span>
        <span className="truncate rounded-full bg-white/[0.04] px-2 py-1">
          {job.sourceLabel}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] text-safran/80">
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </p>
          <p className="mt-1 text-[10px] text-sand/30">
            Publiée {timeAgo(job.publishedAt, referenceDate)}
          </p>
        </div>
        <Link
          href={`/offres/${job.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-sand/65 transition group-hover:text-safran"
        >
          Voir l'offre
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path
              d="M3 8h10m0 0-3.5-3.5M13 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
