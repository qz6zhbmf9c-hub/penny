"use client";
import LoginCard from "@/components/LoginCard";
import ProfileView from "@/components/ProfileView";
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

// Short labels so five tabs fit on an iPhone SE
const SHORT: Record<View, string> = { ov: "Overview", tx: "Activity", bd: "Budgets", gl: "Goals", pr: "Profile" };
const FULL: Record<View, string> = { ov: "Overview", tx: "Transactions", bd: "Budgets", gl: "Goals", pr: "Profile" };

function TabIcon({ k }: { k: View }) {
  switch (k) {
    case "ov":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></svg>);
    case "tx":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16M7 20l-3-3M7 20l3-3" /><path d="M17 20V4M17 4l-3 3M17 4l3 3" /></svg>);
    case "bd":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M12 3a9 9 0 0 1 9 9h-9z" /></svg>);
    case "gl":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></svg>);
    default:
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>);
  }
}

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
    if (!isPro) {
      notify("🔒 Daily streak is a Pro feature!");
      return;
    }
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
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--bg)", color: "var(--tx)" }}>
      <div className="top">
        <a
          href="https://mypenny.net"
          className="logo"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Penny<i>.</i>
        </a>
        <nav className="tabs-desktop" aria-label="Sections">{TABS.map(([k, label]) => <button key={k} className={k === view ? "on" : ""} onClick={() => setView(k)}>{label}</button>)}</nav>
        <div className="top-actions">
          <select className="sel desk-only" aria-label="Currency" value={cur} onChange={(e) => setCur(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
          {isPro ? <button className="s" disabled>✨ Pro</button> : <button className="p" onClick={upgrade}>Go Pro</button>}
          <button
            type="button"
            className="s"
            onClick={handleStreakClick}
            aria-label={isPro ? `${streak}-day streak` : "Daily streak (Pro)"}
            title={
              !isPro
                ? "Daily streak (Pro)"
                : lostStreak > 0
                ? `Tap to restore your ${lostStreak}-day streak to ${lostStreak + 1} (once a month)`
                : `${streak}-day streak`
            }
          >
            {isPro ? (
              <>
                🔥 {streak}
                {lostStreak > 0 && (
                  <>
                    <span className="rs-long"> · Restore ({lostStreak + 1})</span>
                    <span className="rs-short"> ↺ {lostStreak + 1}</span>
                  </>
                )}
              </>
            ) : (
              "🔥🔒"
            )}
          </button>
          <button className="s desk-only" onClick={() => signOut({ callbackUrl: "/dashboard" })}>Sign out</button>
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
        {view === "pr" && (
          <>
            {/* Phones: the currency picker and sign-out live here instead of the header */}
            <div className="card mobile-only" style={{ marginBottom: 14 }}>
              <h3>Preferences</h3>
              <div className="prow">
                <span>Currency</span>
                <select className="sel" aria-label="Currency" value={cur} onChange={(e) => setCur(e.target.value)}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="prow">
                <span>Session</span>
                <button className="s" onClick={() => signOut({ callbackUrl: "/dashboard" })}>Sign out</button>
              </div>
            </div>
            <ProfileView />
          </>
        )}
      </main>
      {/* Phones: iOS-style frosted bottom tab bar (hidden on desktop via CSS) */}
      <nav className="tabbar" aria-label="Primary">
        {TABS.map(([k]) => (
          <button
            key={k}
            className={k === view ? "on" : ""}
            aria-label={FULL[k]}
            aria-current={k === view ? "page" : undefined}
            onClick={() => { setView(k); window.scrollTo({ top: 0 }); }}
          >
            <span className="ic"><TabIcon k={k} /></span>
            <span>{SHORT[k]}</span>
          </button>
        ))}
      </nav>
      <div id="toast" className={toast ? "on" : ""}>{toast}</div>
    </div>
  );
}