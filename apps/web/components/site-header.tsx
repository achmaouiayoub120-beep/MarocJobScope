"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/format";
import { ZelligeMark } from "@/components/zellige";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/offres", label: "Explorer les offres" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-sand/10 bg-night/75 backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-safran/30 bg-safran/10 transition group-hover:border-safran/60 group-hover:bg-safran/15">
            <ZelligeMark className="h-5 w-5 text-safran" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight text-sand">
              MarocJobScope
            </span>
            <span className="block text-[9px] uppercase tracking-[0.24em] text-sand/45 sm:text-[10px]">
              Observatoire fictif
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="flex items-center gap-1 sm:gap-2"
        >
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-2.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
                  active
                    ? "bg-sand/10 text-sand"
                    : "text-sand/60 hover:bg-white/[0.04] hover:text-sand",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
