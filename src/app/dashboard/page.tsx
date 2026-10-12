"use client";
import LoginCard from "@/components/LoginCard";
import ProfileView from "@/components/ProfileView";
import "../globals.css";
import { useCallback, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Budgets, CURRENCIES, Goal, Tx, View } from "@/lib/penny";
import { BudgetsView, GoalsView, Overview, Transactions } from "@/components/Views";

const TABS: [View, string][] = [
  ["ov", "Overview"],
  ["tx", "Transactions"],
  ["bd", "Budgets"],
  ["gl", "Goals"],
  ["pr", "Profile"],
];

export default function Home() {
  const { data: session, status, update } = useSession();
  const isPro = !!session?.user?.isPro;
  const [view, setView] = useState<View>("ov");
  const [cur, setCur] = useState("$");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [budgets, setBudgets] = useState<Budgets>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [toast, setToast] = useState("");
  const f = (n: number) => cur + Math.round(n).toLocaleString();

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const guard = async (fn: () => Promise<unknown>) => { try { await fn(); } catch { notify("Something went wrong"); } };

  const load = useCallback(async () => {
    try {
      setTxs(await api.transactions());
      if (isPro) { setBudgets(await api.budgets()); setGoals(await api.goals()); }
    } catch { notify("Couldn't load your data"); }
  }, [isPro]);

  useEffect(() => { if (status === "authenticated") load(); }, [status, load]);

  // Handle upgrade polling and URL cleanup smoothly
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasUpgradedParam = window.location.search.includes("upgraded=1");
    if (!hasUpgradedParam) return;

    if (isPro) {
      window.history.replaceState({}, "", "/dashboard");
      notify("✨ Welcome to Penny Pro!");
      return;
    }

    if (status !== "authenticated") return;

    let tries = 0;
    const id = setInterval(async () => {
      await update();
      tries++;
      if (tries >= 8) {
        clearInterval(id);
        window.history.replaceState({}, "", "/dashboard");
      }
    }, 2500);

    return () => clearInterval(id);
  }, [status, isPro, update]);

  async function upgrade() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (json.url) window.location.href = json.url;
    else notify(json.error ?? "Could not start checkout");
  }

  if (status === "loading" && !session) return null;
  if (!session) return <LoginCard />;

  return (
    <>
      <div className="top">
        <a
          href="https://penny-nine-gamma.vercel.app/"
          className="logo"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Penny<i>.</i>
        </a>
        <nav>{TABS.map(([k, label]) => <button key={k} className={k === view ? "on" : ""} onClick={() => setView(k)}>{label}</button>)}</nav>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <select value={cur} onChange={(e) => setCur(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
          {isPro ? <button className="s" disabled>✨ Pro</button> : <button className="p" onClick={upgrade}>Go Pro</button>}
          <button className="s" onClick={() => signOut({ callbackUrl: "/dashboard" })}>Sign out</button>
        </div>
      </div>
      <main>
        {view === "ov" && <Overview txs={txs} f={f} isPro={isPro} onUpgrade={upgrade} />}
        {view === "tx" && (
          <Transactions txs={txs} f={f} isPro={isPro} onUpgrade={upgrade} notify={notify}
            onAdd={(x) => guard(async () => { await api.addTransaction(x); setTxs(await api.transactions()); })}
            onDelete={(id) => guard(async () => { await api.deleteTransaction(id); setTxs(await api.transactions()); })} />
        )}
        {view === "bd" && (
          <BudgetsView txs={txs} budgets={budgets} f={f} isPro={isPro} onUpgrade={upgrade}
            onSave={(c, v) => guard(async () => { await api.saveBudget(c, v); setBudgets(await api.budgets()); })} />
        )}
        {view === "gl" && (
          <GoalsView goals={goals} f={f} isPro={isPro} onUpgrade={upgrade}
            onAdd={(n, t) => guard(async () => { await api.addGoal(n, t); setGoals(await api.goals()); })}
            onFund={(id, v) => guard(async () => { await api.fundGoal(id, v); setGoals(await api.goals()); })}
            onDelete={(id) => guard(async () => { await api.deleteGoal(id); setGoals(await api.goals()); })} />
        )}
        {view === "pr" && <ProfileView />}
      </main>
      <div id="toast" className={toast ? "on" : ""}>{toast}</div>
    </>
  );
}