"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { SectorStat } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export function TopSectors({
  sectors,
  total,
}: {
  sectors: SectorStat[];
  total: number;
}) {
  const reduceMotion = useReducedMotion();
  const max = Math.max(...sectors.map((sector) => sector.count), 1);

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-sand sm:text-xl">
            Secteurs qui recrutent
          </h3>
          <p className="mt-1 text-xs text-sand/45">
            Classement fictif sur 300 offres
          </p>
        </div>
        <span className="font-mono text-[11px] text-sand/30">6 / 12</span>
      </div>

      <div className="mt-5 space-y-4">
        {sectors.map((sector, index) => {
          const width = `${(sector.count / max) * 100}%`;
          const share = Math.round((sector.count / total) * 100);
          return (
            <Link
              key={sector.name}
              href={`/offres?secteur=${encodeURIComponent(sector.name)}`}
              className="group block rounded-xl focus-visible:outline-none"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-sand/85 transition group-hover:text-sand">
                  {sector.name}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-sand/40">
                  {formatNumber(sector.count)} · {share}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand/[0.08]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-majorelle via-[#8a6fe8] to-safran"
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={reduceMotion ? undefined : { width }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06 }}
                  style={reduceMotion ? { width } : undefined}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
