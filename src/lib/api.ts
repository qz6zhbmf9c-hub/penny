import type { Tx, Goal, Budgets } from "./penny";

async function j<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
const send = (method: string, b: unknown): RequestInit => ({ method, body: JSON.stringify(b) });

export const api = {
  async transactions(): Promise<Tx[]> {
    const rows = await j<any[]>("/api/transactions");
    return rows.map((r) => ({ id: r.id, d: String(r.date).slice(0, 10), t: r.type === "IN" ? "in" : "out", c: r.category, n: r.note ?? "", a: r.amountCents / 100 }));
  },
  addTransaction: (x: Omit<Tx, "id">) =>
    j("/api/transactions", send("POST", { date: x.d, type: x.t === "in" ? "IN" : "OUT", category: x.c, note: x.n, amountCents: Math.round(x.a * 100) })),
  deleteTransaction: (id: string) => j(`/api/transactions/${id}`, { method: "DELETE" }),

  async budgets(): Promise<Budgets> {
    const rows = await j<any[]>("/api/budgets");
    return Object.fromEntries(rows.map((r) => [r.category, r.limitCents / 100]));
  },
  saveBudget: (category: string, limit: number) =>
    j("/api/budgets", send("PUT", { category, limitCents: Math.round(limit * 100) })),

  async goals(): Promise<Goal[]> {
    const rows = await j<any[]>("/api/goals");
    return rows.map((r) => ({ id: r.id, n: r.name, t: r.targetCents / 100, s: r.savedCents / 100 }));
  },
  addGoal: (name: string, target: number) =>
    j("/api/goals", send("POST", { name, targetCents: Math.round(target * 100) })),
  fundGoal: (id: string, amount: number) =>
    j(`/api/goals/${id}`, send("PATCH", { addCents: Math.round(amount * 100) })),
  deleteGoal: (id: string) => j(`/api/goals/${id}`, { method: "DELETE" }),
};