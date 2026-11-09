import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#0B1020",
        majorelle: "#6050DC",
        safran: "#E9A93B",
        terracotta: "#C8603C",
        sand: "#E8DCC4",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(232,220,196,0.06), 0 24px 80px -32px rgba(96,80,220,0.45)",
        card: "0 18px 50px -30px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(60% 60% at 20% 20%, rgba(96,80,220,0.28) 0%, rgba(11,16,32,0) 70%), radial-gradient(50% 50% at 85% 30%, rgba(200,96,60,0.18) 0%, rgba(11,16,32,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
