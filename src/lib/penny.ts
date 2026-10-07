export type Tx = { id: string; d: string; t: "in" | "out"; c: string; n: string; a: number };
export type Goal = { id: string; n: string; t: number; s: number };
export type Budgets = Record<string, number>;
export type View = "ov" | "tx" | "bd" | "gl";

export const C: Record<string, string> = {
  Housing: "#6366f1", Food: "#f59e0b", Transport: "#06b6d4", Fun: "#ec4899",
  Health: "#10b981", Shopping: "#8b5cf6", Bills: "#ef4444",
};
export const CURRENCIES = ["$", "€", "£", "TND", "CAD", "AED"];

export const ym = (o: number) => {
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - o);
  return d.toISOString().slice(0, 7);
};
export const sum = <T,>(a: T[], fn: (x: T) => number) => a.reduce((s, x) => s + fn(x), 0);
export const mTx = (txs: Tx[], k: string) => txs.filter((x) => x.d.slice(0, 7) === k);
export const spendBy = (txs: Tx[], k: string) => {
  const o: Record<string, number> = {};
  mTx(txs, k).filter((x) => x.t === "out").forEach((x) => { o[x.c] = (o[x.c] || 0) + x.a; });
  return o;
};