import type { Metadata } from "next";
import { Suspense } from "react";

import {
  ExplorerSkeleton,
  JobsExplorer,
} from "@/components/jobs-explorer";

export const metadata: Metadata = {
  title: "Explorer les offres fictives",
  description:
    "Recherche et filtres sur 300 offres fictives réparties dans 12 villes marocaines. Données de démonstration.",
};

export default function OffresPage() {
  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <JobsExplorer />
    </Suspense>
  );
}
