"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import { JobCard } from "@/components/job-card";
import { ZelligePattern } from "@/components/zellige";
import { getFacets, searchJobs } from "@/lib/api";
import type {
  FacetOption,
  Facets,
  SearchResult,
  SortKey,
} from "@/lib/api";
import { formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/lib/use-debounced-value";

const PAGE_SIZE = 12;
const MAX_LIMIT = 300;

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "pertinence", label: "Pertinence" },
  { value: "recent", label: "Plus récentes" },
  { value: "entreprise", label: "Entreprise (A–Z)" },
];

function parseSort(raw: string | null): SortKey {
  if (raw === "recent" || raw === "entreprise") return raw;
  return "pertinence";
}

function parseLimit(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < PAGE_SIZE) return PAGE_SIZE;
  return Math.min(
    MAX_LIMIT,
    Math.round(parsed / PAGE_SIZE) * PAGE_SIZE,
  );
}

function FacetSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: FacetOption[] | undefined;
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-sand/40">
        {label}
      </span>
      <span className="relative mt-1.5 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={!options}
          className="w-full appearance-none rounded-xl border border-sand/10 bg-[#101528] px-3 py-2.5 pr-8 text-xs text-sand/80 outline-none transition hover:border-sand/20 focus:border-safran/50 disabled:cursor-wait disabled:opacity-50"
        >
          <option value="">{allLabel}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} · {option.count}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sand/35"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-sand/40">
        Trier par
      </span>
      <span className="relative mt-1.5 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortKey)}
          className="w-full appearance-none rounded-xl border border-sand/10 bg-[#101528] px-3 py-2.5 pr-8 text-xs text-sand/80 outline-none transition hover:border-sand/20 focus:border-safran/50"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sand/35"
        >
          <path
            d="m4 6 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}

export function ExplorerSkeleton() {
  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="skeleton h-3 w-24 rounded-full" />
      <div className="skeleton mt-4 h-10 w-80 max-w-full rounded-xl" />
      <div className="skeleton mt-3 h-4 w-full max-w-xl rounded" />
      <div className="skeleton mt-7 h-12 w-full rounded-xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
              </div>
            </div>
            <div className="skeleton mt-5 h-5 w-4/5 rounded" />
            <div className="skeleton mt-3 h-3 w-full rounded" />
            <div className="skeleton mt-2 h-3 w-2/3 rounded" />
            <div className="mt-5 flex gap-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const currentQuery = searchParams.get("q") ?? "";
  const reduceMotion = useReducedMotion();

  const [facets, setFacets] = useState<Facets | null>(null);
  const [facetsError, setFacetsError] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [inputValue, setInputValue] = useState(currentQuery);
  const debouncedInput = useDebouncedValue(inputValue, 320);

  const updateParams = useCallback(
    (
      updates: Record<string, string | undefined>,
      resetPagination = true,
    ) => {
      const next = new URLSearchParams(searchKey);
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (resetPagination) next.delete("limite");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchKey],
  );

  useEffect(() => {
    if (debouncedInput.trim() === currentQuery.trim()) return;
    updateParams({ q: debouncedInput.trim() || undefined });
  }, [debouncedInput, currentQuery, updateParams]);

  useEffect(() => {
    let cancelled = false;
    setFacetsError(false);
    getFacets()
      .then((next) => {
        if (!cancelled) setFacets(next);
      })
      .catch(() => {
        if (!cancelled) setFacetsError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(searchKey);
    setLoading(true);
    setError(null);
    searchJobs({
      q: params.get("q") ?? undefined,
      city: params.get("ville") ?? undefined,
      sector: params.get("secteur") ?? undefined,
      contract: params.get("contrat") ?? undefined,
      experience: params.get("experience") ?? undefined,
      source: params.get("source") ?? undefined,
      sort: parseSort(params.get("tri")),
      limit: parseLimit(params.get("limite")),
    })
      .then((next) => {
        if (!cancelled) {
          setResult(next);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "La couche de données de démonstration n'a pas répondu. Réessayez dans un instant.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [searchKey, reloadToken]);

  const cityValue = searchParams.get("ville") ?? "";
  const sectorValue = searchParams.get("secteur") ?? "";
  const contractValue = searchParams.get("contrat") ?? "";
  const experienceValue = searchParams.get("experience") ?? "";
  const sourceValue = searchParams.get("source") ?? "";
  const sortValue = parseSort(searchParams.get("tri"));

  const filterEntries: Array<[string, string]> = [
    ["q", "Recherche"],
    ["ville", "Ville"],
    ["secteur", "Secteur"],
    ["contrat", "Contrat"],
    ["experience", "Expérience"],
    ["source", "Source"],
  ];

  const activeFilters = filterEntries.flatMap(([key, label]) => {
    const value = searchParams.get(key);
    return value ? [{ key, label, value }] : [];
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ q: inputValue.trim() || undefined });
  };

  const clearQuery = () => {
    setInputValue("");
    updateParams({ q: undefined });
  };

  const resetFilters = () => {
    setInputValue("");
    router.replace(pathname, { scroll: false });
  };

  const removeFilter = (key: string) => {
    if (key === "q") setInputValue("");
    updateParams({ [key]: undefined });
  };

  const displayFilterValue = (key: string, value: string) => {
    if (key === "source") {
      return facets?.sources.find((option) => option.value === value)?.label ??
        value;
    }
    return value;
  };

  const showSkeletons = loading && !result;
  const hasFilters = activeFilters.length > 0;

  return (
    <>
      <section className="relative overflow-hidden border-b border-sand/10">
        <ZelligePattern
          id="explorer-zellige"
          opacity={0.06}
          className="zellige-mask text-sand"
        />
        <div className="section-shell relative py-10 sm:py-14">
          <p className="eyebrow">
            <span className="h-px w-7 bg-safran/60" />
            Explorateur
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-sand text-balance sm:text-4xl">
                Les offres fictives
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sand/50">
                Recherche instantanée, filtres à facettes et pagination par
                « charger plus ». Tous les résultats sont générés localement.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-safran/20 bg-safran/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-safran/80">
              <span className="h-1.5 w-1.5 rounded-full bg-safran" />
              300 offres simulées
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sand/35"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="m13.2 13.2 3.3 3.3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Titre, entreprise, compétence, ville…"
                aria-label="Rechercher une offre fictive"
                className="w-full rounded-xl border border-sand/12 bg-[#101528]/90 py-3 pl-10 pr-10 text-sm text-sand placeholder:text-sand/30 outline-none transition focus:border-safran/50 focus:bg-[#101528]"
              />
              {inputValue ? (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-sand/40 transition hover:bg-white/[0.06] hover:text-sand"
                >
                  ×
                </button>
              ) : null}
            </div>
            <button type="submit" className="btn-primary shrink-0 px-4 sm:px-5">
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <section className="section-shell py-7 sm:py-9">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-sand/45">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M2.5 4h11M4.5 8h7M6.5 12h3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              Filtres
            </div>
            <div className="flex items-center gap-3 text-[11px] text-sand/40">
              <span aria-live="polite">
                {result
                  ? `${formatNumber(result.total)} résultat${
                      result.total > 1 ? "s" : ""
                    } fictif${result.total > 1 ? "s" : ""}`
                  : "Chargement…"}
              </span>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-safran/80 underline-offset-4 transition hover:text-safran hover:underline"
                >
                  Tout effacer
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <FacetSelect
              label="Ville"
              value={cityValue}
              options={facets?.cities}
              allLabel="Toutes les villes"
              onChange={(value) =>
                updateParams({ ville: value || undefined })
              }
            />
            <FacetSelect
              label="Secteur"
              value={sectorValue}
              options={facets?.sectors}
              allLabel="Tous les secteurs"
              onChange={(value) =>
                updateParams({ secteur: value || undefined })
              }
            />
            <FacetSelect
              label="Contrat"
              value={contractValue}
              options={facets?.contracts}
              allLabel="Tous les contrats"
              onChange={(value) =>
                updateParams({ contrat: value || undefined })
              }
            />
            <FacetSelect
              label="Expérience"
              value={experienceValue}
              options={facets?.experiences}
              allLabel="Tous les niveaux"
              onChange={(value) =>
                updateParams({ experience: value || undefined })
              }
            />
            <FacetSelect
              label="Source"
              value={sourceValue}
              options={facets?.sources}
              allLabel="Toutes les sources"
              onChange={(value) =>
                updateParams({ source: value || undefined })
              }
            />
            <SortSelect
              value={sortValue}
              onChange={(value) =>
                updateParams({
                  tri: value === "pertinence" ? undefined : value,
                })
              }
            />
          </div>

          {facetsError ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-terracotta">
              Filtres indisponibles.
              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="underline underline-offset-4 hover:text-sand"
              >
                Réessayer
              </button>
            </div>
          ) : null}

          {hasFilters ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  className="chip transition hover:border-safran/40 hover:text-sand"
                >
                  <span className="text-sand/35">{filter.label} :</span>
                  {displayFilterValue(filter.key, filter.value)}
                  <span aria-hidden="true" className="text-sand/35">
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-7" aria-busy={loading}>
          {error ? (
            <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-terracotta/30 bg-terracotta/10 text-terracotta">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    d="M12 8v5m0 3.5v.01M10.3 3.8 2.6 17.1A1.8 1.8 0 0 0 4.2 19.8h15.6a1.8 1.8 0 0 0 1.6-2.7L13.7 3.8a1.8 1.8 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-sand">
                Impossible de charger les offres
              </h2>
              <p className="mt-2 max-w-md text-sm text-sand/50">{error}</p>
              <button
                type="button"
                onClick={() => setReloadToken((token) => token + 1)}
                className="btn-ghost mt-6"
              >
                Réessayer
              </button>
            </div>
          ) : showSkeletons ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-2/3 rounded" />
                      <div className="skeleton h-3 w-1/3 rounded" />
                    </div>
                  </div>
                  <div className="skeleton mt-5 h-5 w-4/5 rounded" />
                  <div className="skeleton mt-3 h-3 w-full rounded" />
                  <div className="skeleton mt-2 h-3 w-2/3 rounded" />
                  <div className="mt-5 flex gap-2">
                    <div className="skeleton h-6 w-16 rounded-full" />
                    <div className="skeleton h-6 w-20 rounded-full" />
                    <div className="skeleton h-6 w-14 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : result && result.total === 0 ? (
            <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-safran/25 bg-safran/10 text-safran">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="m16 16 4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-sand">
                Aucune offre fictive ne correspond
              </h2>
              <p className="mt-2 max-w-md text-sm text-sand/50">
                Essayez un terme plus large ou retirez un filtre. Le jeu de
                démonstration contient 300 offres réparties dans 12 villes.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="btn-ghost mt-6"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : result ? (
            <>
              {loading ? (
                <div className="mb-4 h-0.5 overflow-hidden rounded-full bg-sand/5">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-safran/70" />
                </div>
              ) : null}
              <div
                className={`grid gap-4 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
              >
                {result.items.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index, 8) * 0.03,
                    }}
                  >
                    <JobCard
                      job={job}
                      referenceDate={result.referenceDate}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-center text-xs text-sand/35">
                  Affichage de {formatNumber(result.items.length)} sur{" "}
                  {formatNumber(result.total)} offres fictives
                </p>
                {result.hasMore ? (
                  result.limit >= MAX_LIMIT ? (
                    <p className="text-center text-xs text-sand/30">
                      Limite de démonstration atteinte : affinez les filtres
                      pour voir d'autres offres.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        updateParams(
                          {
                            limite: String(result.limit + PAGE_SIZE),
                          },
                          false,
                        )
                      }
                      className="btn-ghost"
                    >
                      {loading ? "Chargement…" : "Charger plus"}
                    </button>
                  )
                ) : (
                  <p className="text-xs text-sand/25">Fin des résultats.</p>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-sand/10 pt-6 text-[11px] text-sand/30 sm:flex-row sm:items-center">
          <p>
            Tous les résultats sont fictifs. Aucun scraping, aucune offre
            réelle.
          </p>
          <Link
            href="/"
            className="text-sand/45 underline-offset-4 transition hover:text-sand hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </>
  );
}
