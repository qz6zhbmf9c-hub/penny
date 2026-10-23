export type Tx = { id: string; d: string; t: "in" | "out"; c: string; n: string; a: number };
export type Goal = { id: string; n: string; t: number; s: number };
export type Budgets = Record<string, number>;
export type View = "ov" | "tx" | "bd" | "gl" | "pr";

export const C: Record<string, string> = {
  Housing: "#2A4CB0", Food: "#C9821A", Transport: "#3F7FCF", Fun: "#7C4FD0",
  Health: "#CF557F", Shopping: "#BF5426", Bills: "#A3223A",
};
export const CURRENCIES = ["$", "€", "£", "TND", "CAD", "AED"];

export const ym = (o: number) => {
  const d = new Date(); 
  d.setDate(1); 
  d.setMonth(d.getMonth() - o);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
export const sum = <T,>(a: T[], fn: (x: T) => number) => a.reduce((s, x) => s + fn(x), 0);
export const mTx = (txs: Tx[], k: string) => txs.filter((x) => x.d.slice(0, 7) === k);
export const spendBy = (txs: Tx[], k: string) => {
  const o: Record<string, number> = {};
  mTx(txs, k).filter((x) => x.t === "out").forEach((x) => { o[x.c] = (o[x.c] || 0) + x.a; });
  return o;
};