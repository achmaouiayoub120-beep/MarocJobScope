import type { SourceStat } from "@/lib/api";
import { formatNumber } from "@/lib/format";

const COLORS = ["#E9A93B", "#6050DC", "#C8603C", "#E8DCC4"];

export function SourceMix({
  sources,
  total,
}: {
  sources: SourceStat[];
  total: number;
}) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-sand sm:text-xl">
        Sources simulées
      </h3>
      <p className="mt-1 text-xs text-sand/45">
        Quatre flux fictifs, aucun scraping
      </p>
      <div className="mt-4 space-y-3">
        {sources.map((source, index) => (
          <div key={source.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-sand/65">{source.label}</span>
              <span className="font-mono text-[10px] text-sand/35">
                {formatNumber(source.count)}
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-sand/[0.08]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(source.count / total) * 100}%`,
                  background: COLORS[index % COLORS.length],
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
