import { DATA_DISCLAIMER } from "@/lib/api";

export function DemoBanner() {
  return (
    <div className="relative z-[70] border-b border-safran/25 bg-[#151226]/95">
      <div className="section-shell flex items-center justify-center gap-2.5 py-2 text-center">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safran opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-safran" />
        </span>
        <p className="text-[11px] font-medium leading-snug tracking-wide text-sand/90 sm:text-xs">
          {DATA_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
