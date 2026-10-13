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

type StreakData = {
  streak: number;
  lastDate: string;      // YYYY-MM-DD
  lostStreak: number;    // Previous streak if broken and eligible for restore
  lostDate: string;      // YYYY-MM-DD when the streak was last active
  restoredMonth: string; // YYYY-MM when the user last used their monthly restore
};

function getLocalYMD(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function daysBetween(ymd1: string, ymd2: string) {
  const [y1, m1, d1] = ymd1.split("-").map(Number);
  const [y2, m2, d2] = ymd2.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export default function Home() {
  const { data: session, status, update } = useSession();
  const isPro = !!session?.user?.isPro;
  const [view, setView] = useState<View>("ov");
  const [cur, setCur] = useState("$");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [budgets, setBudgets] = useState<Budgets>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [toast, setToast] = useState("");
  const [streak, setStreak] = useState(1);
  const [lostStreak, setLostStreak] = useState(0);

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

  // Pro Streak tracking & monthly restore eligibility
  useEffect(() => {
    if (typeof window === "undefined" || status !== "authenticated" || !isPro) return;
    const userKey = session?.user?.id || session?.user?.email || "default";
    const storageKey = `penny_streak_${userKey}`;
    const today = getLocalYMD();
    const currentYM = today.slice(0, 7);

    let data: StreakData = {
      streak: 0,
      lastDate: "",
      lostStreak: 0,
      lostDate: "",
      restoredMonth: "",
    };

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) data = { ...data, ...JSON.parse(raw) };
    } catch {}

    if (!data.lastDate) {
      // Brand new Pro user: start at 1
      data.streak = 1;
      data.lastDate = today;
      data.lostStreak = 0;
    } else {
      const diff = daysBetween(data.lastDate, today);

      if (diff === 0) {
        // Already visited today: expire restore if month somehow changed
        if (data.lostDate && data.lostDate.slice(0, 7) !== currentYM) {
          data.lostStreak = 0;
        }
      } else if (diff === 1) {
        // Consecutive day: increment streak
        data.streak = (data.streak || 0) + 1;
        data.lastDate = today;
        data.lostStreak = 0;
        data.lostDate = "";
      } else if (diff > 1) {
        // Missed at least one full day -> streak drops to 0
        const sameMonth = data.lastDate.slice(0, 7) === currentYM;
        const withinMonthWindow = diff <= 30 && sameMonth;
        const canRestoreThisMonth = data.restoredMonth !== currentYM;

        if (data.streak > 0 && withinMonthWindow && canRestoreThisMonth) {
          data.lostStreak = data.streak;
          data.lostDate = data.lastDate;
        } else {
          data.lostStreak = 0;
          data.lostDate = "";
        }

        data.streak = 0;
        data.lastDate = today;
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
    setStreak(data.streak);
    setLostStreak(data.lostStreak);
  }, [status, isPro, session]);

  function handleStreakClick() {
    if (!isPro) return;
    const userKey = session?.user?.id || session?.user?.email || "default";
    const storageKey = `penny_streak_${userKey}`;
    const today = getLocalYMD();
    const currentYM = today.slice(0, 7);

    if (lostStreak > 0) {
      const newStreak = lostStreak + 1;
      const updated: StreakData = {
        streak: newStreak,
        lastDate: today,
        lostStreak: 0,
        lostDate: "",
        restoredMonth: currentYM,
      };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setStreak(newStreak);
      setLostStreak(0);
      notify(`🔥 Streak restored to ${newStreak}! (Monthly restore used)`);
    } else {
      notify(
        streak > 0
          ? `🔥 ${streak}-day streak! Keep coming back daily.`
          : "🔥 Streak is at 0. Come back tomorrow to build it up!"
      );
    }
  }

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
          href="https://mypenny.net"
          className="logo"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Penny<i>.</i>
        </a>
        <nav>{TABS.map(([k, label]) => <button key={k} className={k === view ? "on" : ""} onClick={() => setView(k)}>{label}</button>)}</nav>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <select value={cur} onChange={(e) => setCur(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
          {isPro ? <button className="s" disabled>✨ Pro</button> : <button className="p" onClick={upgrade}>Go Pro</button>}
          {isPro && (
            <button
              type="button"
              onClick={handleStreakClick}
              title={
                lostStreak > 0
                  ? `Tap to restore your ${lostStreak}-day streak to ${lostStreak + 1} (once a month)`
                  : `${streak}-day streak`
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                background: "#faeedb",
                border: "1.5px solid #ebcfa8",
                color: "#9c5134",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                lineHeight: 1.2,
              }}
            >
              <span>🔥</span>
              <span>{streak}</span>
              {lostStreak > 0 && (
                <span style={{ fontSize: 12, textDecoration: "underline", marginLeft: 2 }}>
                  Restore ({lostStreak + 1})
                </span>
              )}
            </button>
          )}
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