import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JobCard } from "@/components/job-card";
import { ZelligePattern } from "@/components/zellige";
import { DEMO_REFERENCE_DATE, getJob } from "@/lib/api";
import {
  formatDate,
  formatSalary,
  sectorTone,
  timeAgo,
} from "@/lib/format";

const loadJob = cache(getJob);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const detail = await loadJob(params.id);
  if (!detail) {
    return { title: "Offre introuvable" };
  }
  return {
    title: `${detail.job.title} — ${detail.job.company}`,
    description: detail.job.description.split("\n\n")[0],
  };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-sand/5 pb-3 last:border-0 last:pb-0">
      <dt className="shrink-0 text-sand/40">{label}</dt>
      <dd className="text-right font-medium text-sand/80">{value}</dd>
    </div>
  );
}

export default async function JobPage({
  params,
}: {
  params: { id: string };
}) {
  const detail = await loadJob(params.id);
  if (!detail) {
    notFound();
  }

  const { job, similar } = detail;
  const tone = sectorTone(job.sector);
  const paragraphs = job.description.split("\n\n");

  return (
    <>
      <section className="relative overflow-hidden border-b border-sand/10">
        <ZelligePattern
          id="job-zellige"
          opacity={0.07}
          className="zellige-mask text-sand"
        />
        <div className="section-shell relative py-9 sm:py-12">
          <Link
            href="/offres"
            className="inline-flex items-center gap-1.5 text-xs text-sand/45 transition hover:text-sand"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="h-3.5 w-3.5"
            >
              <path
                d="M13 8H3m0 0 3.5-3.5M3 8l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Toutes les offres fictives
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-medium"
              style={{
                color: tone.color,
                background: tone.background,
                borderColor: tone.border,
              }}
            >
              {job.sector}
            </span>
            <span className="chip">{job.contract}</span>
            <span className="chip">{job.experience}</span>
            <span className="chip">{job.workMode}</span>
          </div>

          <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-sand text-balance sm:text-4xl lg:text-5xl">
            {job.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-sand/50">
            <span className="font-medium text-sand/85">{job.company}</span>
            <span className="text-sand/20">·</span>
            <span>{job.city}</span>
            <span className="text-sand/20">·</span>
            <span>Publiée {timeAgo(job.publishedAt, DEMO_REFERENCE_DATE)}</span>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-5 py-8 sm:py-10 lg:grid-cols-[1.28fr_0.72fr]">
        <div className="space-y-5">
          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-sand">
              Le poste
            </h2>
            <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-sand/60">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-sand">
              Compétences demandées
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-safran/20 bg-safran/[0.07] px-3 py-1.5 text-xs font-medium text-safran/90"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {similar.length > 0 ? (
            <div>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-sand">
                  Offres similaires
                </h2>
                <span className="font-mono text-[10px] text-sand/30">
                  fictives
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {similar.map((candidate) => (
                  <JobCard
                    key={candidate.id}
                    job={candidate}
                    referenceDate={DEMO_REFERENCE_DATE}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-5">
          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-sand">
              En bref
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow label="Contrat" value={job.contract} />
              <DetailRow label="Expérience" value={job.experience} />
              <DetailRow label="Mode" value={job.workMode} />
              <DetailRow label="Ville" value={job.city} />
              <DetailRow
                label="Rémunération"
                value={formatSalary(
                  job.salaryMin,
                  job.salaryMax,
                  job.currency,
                )}
              />
              <DetailRow
                label="Publiée le"
                value={formatDate(job.publishedAt)}
              />
              <DetailRow label="Expire le" value={formatDate(job.expiresAt)} />
            </dl>
            <button
              type="button"
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-xl border border-sand/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-sand/35"
            >
              Candidature désactivée en mode démonstration
            </button>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-sand">
              Source
            </h2>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-sand/10 bg-white/[0.02] px-3 py-3 text-xs text-sand/50">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
              >
                <rect
                  x="3.5"
                  y="7"
                  width="9"
                  height="6"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Lien source masqué en mode démonstration
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-sand/35">
              Source simulée : {job.sourceLabel}. Aucune redirection externe,
              aucune candidature réelle.
            </p>
          </div>

          <div className="rounded-3xl border border-safran/20 bg-safran/[0.05] p-5 text-xs leading-relaxed text-sand/55">
            <p className="font-medium text-safran/90">
              Données de démonstration
            </p>
            <p className="mt-2">
              Cette offre, son entreprise et sa rémunération sont fictives.
              Elles servent uniquement à éprouver l'interface.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
