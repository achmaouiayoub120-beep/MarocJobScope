"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { CityStat } from "@/lib/api";
import { cn, formatDate, formatNumber } from "@/lib/format";
import { ZelligePattern } from "@/components/zellige";

const VIEW_WIDTH = 520;
const VIEW_HEIGHT = 620;
const BOUNDS = {
  minLng: -10.8,
  maxLng: -0.8,
  minLat: 28.6,
  maxLat: 36.1,
};

const OUTLINE: Array<[number, number]> = [
  [-5.95, 35.85],
  [-5.4, 35.75],
  [-4.3, 35.2],
  [-3.0, 35.15],
  [-2.2, 35.1],
  [-1.8, 34.7],
  [-1.6, 33.6],
  [-1.2, 32.9],
  [-1.0, 32.0],
  [-1.6, 31.2],
  [-2.5, 30.5],
  [-3.8, 29.8],
  [-5.5, 29.2],
  [-7.0, 28.8],
  [-8.6, 28.7],
  [-9.7, 29.4],
  [-9.9, 30.3],
  [-9.7, 31.2],
  [-9.4, 32.2],
  [-8.9, 33.0],
  [-8.4, 33.6],
  [-7.6, 33.75],
  [-6.9, 34.05],
  [-6.4, 34.5],
  [-5.9, 35.1],
  [-5.7, 35.65],
];

function project(lng: number, lat: number) {
  const x =
    ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * VIEW_WIDTH;
  const y =
    ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VIEW_HEIGHT;
  return { x, y };
}

const MOROCCO_PATH = `${OUTLINE.map(([lng, lat], index) => {
  const { x, y } = project(lng, lat);
  return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ")} Z`;

export function MoroccoMap({
  cities,
  referenceDate,
}: {
  cities: CityStat[];
  referenceDate: string;
}) {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState<CityStat | null>(null);
  const maxCount = Math.max(...cities.map((city) => city.count), 1);

  const openCity = (city: CityStat) => {
    router.push(`/offres?ville=${encodeURIComponent(city.name)}`);
  };

  return (
    <div className="glass relative overflow-hidden rounded-3xl">
      <ZelligePattern
        id="map-zellige"
        opacity={0.055}
        className="text-sand"
      />
      <div className="relative p-3 sm:p-5">
        <div className="relative">
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Carte stylisée du Maroc avec les 12 villes de démonstration"
          >
            <defs>
              <linearGradient id="map-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6050DC" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0B1020" stopOpacity="0.02" />
              </linearGradient>
              <radialGradient id="city-glow">
                <stop offset="0%" stopColor="#E9A93B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E9A93B" stopOpacity="0" />
              </radialGradient>
              <filter id="soft-glow">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            <g
              stroke="#E8DCC4"
              strokeOpacity="0.1"
              strokeWidth="0.5"
              strokeDasharray="2 7"
            >
              {[30, 32, 34, 36].map((lat) => {
                const { y } = project(BOUNDS.minLng, lat);
                return (
                  <line
                    key={`lat-${lat}`}
                    x1="0"
                    y1={y}
                    x2={VIEW_WIDTH}
                    y2={y}
                  />
                );
              })}
              {[-10, -8, -6, -4, -2].map((lng) => {
                const { x } = project(lng, BOUNDS.minLat);
                return (
                  <line
                    key={`lng-${lng}`}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2={VIEW_HEIGHT}
                  />
                );
              })}
            </g>

            <path
              d={MOROCCO_PATH}
              fill="none"
              stroke="#6050DC"
              strokeOpacity="0.3"
              strokeWidth="8"
              filter="url(#soft-glow)"
            />
            <path
              d={MOROCCO_PATH}
              fill="url(#map-fill)"
              stroke="rgba(232,220,196,0.3)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {cities.map((city) => {
              const { x, y } = project(city.lng, city.lat);
              const radius = 5 + 14 * Math.sqrt(city.count / maxCount);
              const active = activeCity?.name === city.name;
              const labelOnLeft = x > VIEW_WIDTH / 2;
              return (
                <g
                  key={city.name}
                  role="button"
                  tabIndex={0}
                  aria-label={`${city.name} : ${city.count} offres fictives`}
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  onFocus={() => setActiveCity(city)}
                  onBlur={() => setActiveCity(null)}
                  onClick={() => openCity(city)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openCity(city);
                    }
                  }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={radius + 10}
                    fill="url(#city-glow)"
                    opacity={active ? 0.9 : 0.35}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="#E9A93B"
                    fillOpacity={active ? 0.95 : 0.6}
                    stroke="#E8DCC4"
                    strokeOpacity={active ? 1 : 0.55}
                    strokeWidth={active ? 2.4 : 1.2}
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={2.2}
                    fill="#0B1020"
                    fillOpacity="0.7"
                  />
                  <text
                    x={labelOnLeft ? x - radius - 7 : x + radius + 7}
                    y={y + 3.5}
                    textAnchor={labelOnLeft ? "end" : "start"}
                    fill="#E8DCC4"
                    fillOpacity={active ? 0.95 : 0.5}
                    fontSize="10.5"
                    fontFamily="var(--font-space-grotesk), sans-serif"
                    className="hidden transition-opacity duration-200 sm:block"
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {activeCity ? (
            <div
              className="pointer-events-none absolute z-10 w-max max-w-[190px] -translate-x-1/2 rounded-xl border border-sand/15 bg-[#11162a]/95 px-3 py-2 shadow-card backdrop-blur-md"
              style={{
                left: `${(project(activeCity.lng, activeCity.lat).x / VIEW_WIDTH) * 100}%`,
                top: `${(project(activeCity.lng, activeCity.lat).y / VIEW_HEIGHT) * 100}%`,
                transform: `translate(-50%, ${
                  project(activeCity.lng, activeCity.lat).y < 90
                    ? "18%"
                    : "-118%"
                })`,
              }}
            >
              <p className="text-xs font-semibold text-sand">
                {activeCity.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-safran">
                {formatNumber(activeCity.count)} offres fictives
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {cities.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => openCity(city)}
              className={cn(
                "chip transition hover:border-safran/40 hover:text-sand",
                activeCity?.name === city.name &&
                  "border-safran/40 text-sand",
              )}
            >
              {city.name}
              <span className="font-mono text-safran/80">{city.count}</span>
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-sand/35">
          Carte stylisée — positions réelles des villes, volumes fictifs.
          Cliquez sur une ville pour filtrer l'explorateur. Fenêtre de
          référence : {formatDate(referenceDate)}.
        </p>
      </div>
    </div>
  );
}
