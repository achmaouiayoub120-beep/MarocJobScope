import Link from "next/link";

import { DEMO_REFERENCE_DATE } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { ZelligeMark } from "@/components/zellige";

const DAY_MS = 86_400_000;
const windowStart = new Date(
  Date.parse(DEMO_REFERENCE_DATE) - 90 * DAY_MS,
).toISOString();

export function SiteFooter() {
  return (
    <footer className="border-t border-sand/10 bg-black/20">
      <div className="section-shell grid gap-8 py-10 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <ZelligeMark className="h-5 w-5 text-safran" />
            <p className="font-display text-lg font-semibold text-sand">
              MarocJobScope
            </p>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-sand/55">
            Prototype d'interface pour un observatoire du marché de l'emploi au
            Maroc. Toutes les offres, entreprises, villes associées et
            statistiques sont fictives et générées localement. Aucun scraping,
            aucune donnée réelle.
          </p>
          <p className="mt-3 text-xs text-sand/35">
            Fenêtre simulée : {formatDate(windowStart)} —{" "}
            {formatDate(DEMO_REFERENCE_DATE)} · seed fixe 42
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/"
            className="text-sm text-sand/60 transition hover:text-sand"
          >
            Accueil
          </Link>
          <Link
            href="/offres"
            className="text-sm text-sand/60 transition hover:text-sand"
          >
            Explorer les offres
          </Link>
          <p className="mt-2 text-xs text-sand/30">
            Next.js 14 · Tailwind · Framer Motion · Recharts
          </p>
        </div>
      </div>
    </footer>
  );
}
