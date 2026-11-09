import { cn } from "@/lib/format";

export function ZelligeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.6 14.7 8.2 20.9 9 16.4 13.2 17.5 19.3 12 16.4 6.5 19.3 7.6 13.2 3.1 9 9.3 8.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ZelligePattern({
  className,
  opacity = 0.12,
  id = "zellige",
}: {
  className?: string;
  opacity?: number;
  id?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            <path d="M36 4 68 36 36 68 4 36Z" />
            <path d="M14 14 58 58M58 14 14 58" />
            <path d="M36 0v8M36 64v8M0 36h8M64 36h8" />
            <circle cx="36" cy="36" r="8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
