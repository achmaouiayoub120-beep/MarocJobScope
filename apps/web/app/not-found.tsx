import Link from "next/link";

import { ZelligePattern } from "@/components/zellige";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <ZelligePattern
        id="notfound-zellige"
        opacity={0.07}
        className="zellige-mask text-sand"
      />
      <div className="section-shell relative flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-sand text-balance sm:text-4xl">
          Cette offre fictive n'existe pas
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-sand/50">
          L'identifiant demandé ne correspond à aucune des 300 offres du jeu de
          démonstration.
        </p>
        <Link href="/offres" className="btn-primary mt-7">
          Retour à l'explorateur
        </Link>
      </div>
    </section>
  );
}
