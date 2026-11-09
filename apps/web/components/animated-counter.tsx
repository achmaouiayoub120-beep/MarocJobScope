"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { formatNumber } from "@/lib/format";

export function AnimatedCounter({
  value,
  duration = 1300,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [value, duration, reduceMotion]);

  return <span className={className}>{formatNumber(display)}</span>;
}
