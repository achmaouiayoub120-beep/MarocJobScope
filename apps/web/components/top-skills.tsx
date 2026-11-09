import Link from "next/link";

import type { SkillStat } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export function TopSkills({ skills }: { skills: SkillStat[] }) {
  const max = Math.max(...skills.map((skill) => skill.count), 1);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {skills.map((skill, index) => (
        <Link
          key={skill.name}
          href={`/offres?q=${encodeURIComponent(skill.name)}`}
          className="glass-soft group flex items-center gap-3 rounded-xl px-3.5 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-safran/30 hover:bg-white/[0.04]"
        >
          <span className="w-5 shrink-0 font-mono text-[10px] text-sand/25">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-sand/85 transition group-hover:text-sand">
            {skill.name}
          </span>
          <span className="shrink-0 font-mono text-[11px] text-safran/80">
            {formatNumber(skill.count)}
          </span>
          <span className="hidden h-1 w-14 overflow-hidden rounded-full bg-sand/10 sm:block">
            <span
              className="block h-full rounded-full bg-safran/80"
              style={{ width: `${(skill.count / max) * 100}%` }}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
