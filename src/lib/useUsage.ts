"use client";
import { useEffect, useState } from "react";

export type Usage = { aiLeft: number; roastLeft: number };

export function useUsage(isPro: boolean) {
  const [usage, setUsage] = useState<Usage | null>(null);
  useEffect(() => {
    if (isPro) return;
    let alive = true;
    fetch("/api/usage")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j) setUsage(j); })
      .catch(() => {});
    return () => { alive = false; };
  }, [isPro]);
  return [usage, setUsage] as const;
}