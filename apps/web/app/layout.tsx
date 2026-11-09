import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MarocJobScope — Observatoire fictif de l'emploi au Maroc",
    template: "%s | MarocJobScope",
  },
  description:
    "Prototype d'observatoire du marché de l'emploi au Maroc. 300 offres fictives, 12 villes, données de démonstration.",
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <DemoBanner />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
