import { ZelligeMark } from "@/components/zellige";

export function SectionDivider() {
  return (
    <div className="section-shell" aria-hidden="true">
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-sand/15" />
        <ZelligeMark className="h-4 w-4 text-safran/60" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-sand/15" />
      </div>
    </div>
  );
}
