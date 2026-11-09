"use client";

import { useReducedMotion } from "framer-motion";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export function TrendChart({
  data,
  referenceDate,
}: {
  data: TrendPoint[];
  referenceDate: string;
}) {
  const reduceMotion = useReducedMotion();
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <div className="glass overflow-hidden rounded-3xl p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-sand sm:text-xl">
            Offres publiées par jour
          </h3>
          <p className="mt-1 text-xs text-sand/45">
            {formatNumber(total)} publications fictives sur la fenêtre de
            démonstration
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-sand/55">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-5 rounded-full bg-majorelle" />
            Volume quotidien
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-5 rounded-full bg-safran" />
            Moyenne 7 jours
          </span>
        </div>
      </div>

      <div className="mt-5 h-[260px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6050DC" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6050DC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(232,220,196,0.07)"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={14}
              minTickGap={22}
              tick={{ fill: "rgba(232,220,196,0.4)", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={38}
              tick={{ fill: "rgba(232,220,196,0.4)", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(233,169,59,0.35)", strokeWidth: 1 }}
              contentStyle={{
                background: "#11162a",
                border: "1px solid rgba(232,220,196,0.14)",
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 18px 50px -30px rgba(0,0,0,0.9)",
              }}
              labelStyle={{ color: "#E8DCC4", marginBottom: 4 }}
              itemStyle={{ color: "#E8DCC4" }}
              formatter={(value) => [
                `${formatNumber(Number(value))} offres`,
                "",
              ]}
              labelFormatter={(label) => `Journée du ${label}`}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Volume quotidien"
              stroke="#6050DC"
              strokeWidth={2}
              fill="url(#trend-fill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#E9A93B",
                stroke: "#0B1020",
                strokeWidth: 2,
              }}
              isAnimationActive={!reduceMotion}
            />
            <Line
              type="monotone"
              dataKey="average"
              name="Moyenne 7 jours"
              stroke="#E9A93B"
              strokeWidth={1.8}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={!reduceMotion}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[11px] text-sand/30">
        Fenêtre simulée se terminant le {referenceDate.slice(0, 10)}. Chaque
        point est fictif.
      </p>
    </div>
  );
}
