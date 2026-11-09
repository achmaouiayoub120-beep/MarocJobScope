import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p className="eyebrow">
        <span className="h-px w-7 bg-safran/60" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-sand text-balance sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-sand/55 sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
