import Link from "next/link";

import { KpiCard } from "@/components/kpi-card";
import { MoroccoMap } from "@/components/morocco-map";
import { Reveal } from "@/components/reveal";
import { SectionDivider } from "@/components/section-divider";
import { SectionHeading } from "@/components/section-heading";
import { SourceMix } from "@/components/source-mix";
import { TopSectors } from "@/components/top-sectors";
import { TopSkills } from "@/components/top-skills";
import { TrendChart } from "@/components/trend-chart";
import { ZelligePattern } from "@/components/zellige";
import { getOverview } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export default async function HomePage() {
  const overview = await getOverview();
  const topSector = overview.topSectors[0];
  const topSkill = overview.topSkills[0];
  const topSectorShare = topSector
    ? Math.round((topSector.count / overview.activeJobs) * 100)
    : 0;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <ZelligePattern
          id="hero-zellige"
          opacity={0.09}
          className="zellige-mask text-sand"
        />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-majorelle/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-terracotta/10 blur-3xl" />

        <div className="section-shell relative pb-16 pt-14 sm:pt-20 lg:pb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-safran/25 bg-safran/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-safran/90 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-safran" />
              Prototype frontend · données fictives
            </span>

            <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-semibold leading-[0.98] tracking-tight text-sand text-balance sm:text-6xl lg:text-7xl">
              L'emploi au Maroc,
              <span className="block italic text-safran">
                en atlas numérique.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-sand/60 sm:text-lg">
              MarocJobScope est un{" "}
              <strong className="font-medium text-sand/90">
                observatoire de démonstration
              </strong>{" "}
              : {formatNumber(overview.activeJobs)} offres fictives, 12 villes,
              12 secteurs et 90 jours de dynamique simulée. Aucune donnée
              réelle, aucun scraping.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/offres" className="btn-primary">
                Explorer les {formatNumber(overview.activeJobs)} offres
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <a href="#villes" className="btn-ghost">
                Voir la carte
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-sand/30 sm:text-[11px]">
              <span>Seed 42</span>
              <span className="text-sand/15">·</span>
              <span>Généré localement</span>
              <span className="text-sand/15">·</span>
              <span>4 sources fictives</span>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
            <KpiCard
              label="Offres actives"
              value={overview.activeJobs}
              caption="sur la fenêtre de 90 jours"
              icon="briefcase"
              accent="safran"
              delay={0}
            />
            <KpiCard
              label="Nouvelles · 7 jours"
              value={overview.newLast7Days}
              caption="fenêtre de référence simulée"
              icon="sparkles"
              accent="majorelle"
              delay={0.06}
            />
            <KpiCard
              label="Entreprises fictives"
              value={overview.companies}
              caption="noms entièrement inventés"
              icon="building"
              accent="terracotta"
              delay={0.12}
            />
            <KpiCard
              label="Villes couvertes"
              value={overview.cityCount}
              caption="positions réelles, volumes fictifs"
              icon="map"
              accent="sand"
              delay={0.18}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="villes" className="section-shell py-14 sm:py-20">
        <SectionHeading
          eyebrow="Géographie"
          title="Les villes en un coup d'œil"
          description="Les 12 villes sont placées par leurs coordonnées réelles ; les volumes d'offres, eux, sont entièrement fictifs. Cliquez sur un point ou une ville pour ouvrir l'explorateur filtré."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal>
            <MoroccoMap
              cities={overview.cities}
              referenceDate={overview.referenceDate}
            />
          </Reveal>
          <div className="space-y-5">
            <Reveal delay={0.08}>
              <TopSectors
                sectors={overview.topSectors}
                total={overview.activeJobs}
              />
            </Reveal>
            <Reveal delay={0.16}>
              <SourceMix
                sources={overview.sources}
                total={overview.activeJobs}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="section-shell py-14 sm:py-20">
        <SectionHeading
          eyebrow="Dynamique"
          title="90 jours de marché fictif"
          description="Une courbe de publications quotidiennes et sa moyenne glissante sur 7 jours. Le motif est volontairement irrégulier : c'est un jeu de démonstration, pas une série observée."
        />
        <Reveal className="mt-8">
          <TrendChart
            data={overview.trend}
            referenceDate={overview.referenceDate}
          />
        </Reveal>
      </section>

      <SectionDivider />

      <section className="section-shell py-14 sm:py-20">
        <SectionHeading
          eyebrow="Compétences"
          title="Les compétences les plus demandées"
          description="Dix compétences extraites des descriptions fictives. Aucune précision de parsing n'est mesurée ni revendiquée : ce prototype illustre une interface."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <div className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6">
              <ZelligePattern
                id="skills-zellige"
                opacity={0.06}
                className="text-safran"
              />
              <div className="relative">
                <p className="eyebrow">Lecture rapide</p>
                <p className="mt-4 font-display text-2xl leading-snug text-sand text-balance">
                  {topSector
                    ? `${topSector.name} concentre ${formatNumber(
                        topSector.count,
                      )} offres fictives, soit ${topSectorShare} % du jeu.`
                    : "Aucune donnée disponible."}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-sand/50">
                  {topSkill
                    ? `${topSkill.name} apparaît dans ${formatNumber(
                        topSkill.count,
                      )} annonces simulées.`
                    : ""}{" "}
                  Ces chiffres servent à éprouver la mise en page, pas à tirer
                  une conclusion sur le marché réel.
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-sand/25">
                <span className="h-px w-6 bg-safran/40" />
                Données de démonstration
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <TopSkills skills={overview.topSkills} />
          </Reveal>
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-24">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
            <ZelligePattern
              id="cta-zellige"
              opacity={0.08}
              className="zellige-mask text-majorelle"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow">Explorer</p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-sand text-balance sm:text-3xl">
                  300 offres fictives, cinq filtres, une carte.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-sand/50">
                  Recherchez par intitulé, filtrez par ville, secteur, contrat,
                  expérience ou source. Les filtres sont synchronisés avec
                  l'URL.
                </p>
              </div>
              <Link href="/offres" className="btn-primary shrink-0">
                Ouvrir l'explorateur
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
