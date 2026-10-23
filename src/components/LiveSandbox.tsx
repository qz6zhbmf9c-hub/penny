"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bars, Donut } from "./Charts";
import { Budgets, C, CURRENCIES, Goal, Tx, View, mTx, spendBy, sum, ym } from "@/lib/penny";

const TABS: [View, string][] = [
  ["ov", "Overview"],
  ["tx", "Transactions"],
  ["bd", "Budgets"],
  ["gl", "Goals"],
  ["pr", "Profile"],
];

const INITIAL_DEMO_TXS: Tx[] = [
  { id: "d1", d: "2026-10-18", t: "in", c: "Income", n: "Monthly Salary", a: 5200 },
  { id: "d2", d: "2026-10-16", t: "out", c: "Housing", n: "Apartment Rent", a: 1650 },
  { id: "d3", d: "2026-10-15", t: "out", c: "Food", n: "Trader Joe's Groceries", a: 184 },
  { id: "d4", d: "2026-10-14", t: "in", c: "Income", n: "Design Freelance", a: 1200 },
  { id: "d5", d: "2026-10-12", t: "out", c: "Shopping", n: "Apple AirPods Pro", a: 249 },
  { id: "d6", d: "2026-10-11", t: "out", c: "Transport", n: "Shell V-Power Gas", a: 62 },
  { id: "d7", d: "2026-10-09", t: "out", c: "Food", n: "DoorDash Sushi", a: 78 },
  { id: "d8", d: "2026-10-07", t: "out", c: "Bills", n: "Fiber Internet & Electric", a: 195 },
  { id: "d9", d: "2026-10-05", t: "out", c: "Fun", n: "IMAX & Drinks", a: 94 },
  { id: "d10", d: "2026-10-03", t: "out", c: "Health", n: "Equinox Gym", a: 140 },
  { id: "p1", d: "2026-09-15", t: "in", c: "Income", n: "Salary", a: 5800 },
  { id: "p2", d: "2026-09-18", t: "out", c: "Housing", n: "Monthly Expenses", a: 3100 },
  { id: "p3", d: "2026-08-15", t: "in", c: "Income", n: "Salary", a: 5400 },
  { id: "p4", d: "2026-08-18", t: "out", c: "Housing", n: "Monthly Expenses", a: 2950 },
  { id: "p5", d: "2026-07-15", t: "in", c: "Income", n: "Salary", a: 6100 },
  { id: "p6", d: "2026-07-18", t: "out", c: "Housing", n: "Monthly Expenses", a: 3400 },
  { id: "p7", d: "2026-06-15", t: "in", c: "Income", n: "Salary", a: 5200 },
  { id: "p8", d: "2026-06-18", t: "out", c: "Housing", n: "Monthly Expenses", a: 2800 },
  { id: "p9", d: "2026-05-15", t: "in", c: "Income", n: "Salary", a: 5500 },
  { id: "p10", d: "2026-05-18", t: "out", c: "Housing", n: "Monthly Expenses", a: 3200 },
];

const INITIAL_BUDGETS: Budgets = { Housing: 1700, Food: 450, Transport: 250, Fun: 200, Health: 180, Shopping: 350, Bills: 250 };
const INITIAL_GOALS: Goal[] = [
  { id: "g1", n: "Emergency Fund 🛡️", t: 10000, s: 8500 },
  { id: "g2", n: "Tokyo Trip ✈️", t: 4000, s: 2650 },
  { id: "g3", n: "MacBook Pro M5 💻", t: 2500, s: 1900 },
];

const DEMO_ROASTS = [
  "You make $6,400 but spend like you won the lottery. $78 on delivery sushi while your kitchen gathers dust? Do better.",
  "Your savings rate is decent, but Equinox and DoorDash are fighting a war for your wallet. Pick a struggle.",
  "You budget like a CFO on Monday, but swipe like a toddler in a toy store by Friday. Stop funding the local barista's retirement.",
];

export default function LiveSandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const clip = Math.max(0, Math.min(100, ((scrollY - 50) / 800) * 100));
      document.documentElement.style.setProperty("--nav-clip", `${clip}%`);
      
      const spark = clip > 85 ? 1 : 0;
      document.documentElement.style.setProperty("--spark-opacity", `${spark}`);

      const logoOp = clip === 100 ? 0 : 1;
      document.documentElement.style.setProperty("--logo-opacity", `${logoOp}`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.setProperty("--nav-clip", "0%");
      document.documentElement.style.setProperty("--spark-opacity", "0");
      document.documentElement.style.setProperty("--logo-opacity", "1");
    };
  }, []);
  
  const [glassPhase, setGlassPhase] = useState<"waiting" | "visible" | "fading" | "gone">("waiting");

  const [view, setView] = useState<View>("ov");
  const [cur, setCur] = useState("$");
  const [txs, setTxs] = useState<Tx[]>(INITIAL_DEMO_TXS);
  const [budgets, setBudgets] = useState<Budgets>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [streak, setStreak] = useState(14);
  const [restored, setRestored] = useState(false);
  const [toast, setToast] = useState("");

  const [t, setT] = useState<"in" | "out">("out");
  const [a, setA] = useState("");
  const [c, setC] = useState("Food");
  const [n, setN] = useState("");
  const [d, setD] = useState("");
  const [q, setQ] = useState("");
  const [simBusy, setSimBusy] = useState<"voice" | "receipt" | null>(null);

  const [roastIdx, setRoastIdx] = useState(0);
  const [roastBusy, setRoastBusy] = useState(false);

  const [gn, setGn] = useState("");
  const [gt, setGt] = useState("");
  const [goalInputs, setGoalInputs] = useState<Record<string, string>>({});

  const f = (val: number) => cur + Math.round(val).toLocaleString();
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  useEffect(() => {
    setMounted(true);
    setD(new Date().toLocaleDateString("en-CA"));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && glassPhase === "waiting") {
          setGlassPhase("visible");
        }
      },
      { threshold: 0.32 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, glassPhase]);

  useEffect(() => {
    if (glassPhase !== "visible") return;
    const t1 = setTimeout(() => setGlassPhase("fading"), 3000);
    const t2 = setTimeout(() => setGlassPhase("gone"), 3850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [glassPhase]);

  if (!mounted) {
    return (
      <section className="wrap sandbox-sec" aria-label="Interactive Live Demo" style={{ minHeight: 800, opacity: 0 }}>
        <div className="sandbox-head"><span className="eyebrow">Interactive Sandbox</span></div>
        <div className="sandbox-shell"></div>
      </section>
    );
  }

  const k = ym(0), p = ym(1);
  const inc = sum(mTx(txs, k).filter((x) => x.t === "in"), (x) => x.a);
  const exp = sum(mTx(txs, k).filter((x) => x.t === "out"), (x) => x.a);
  const pe = sum(mTx(txs, p).filter((x) => x.t === "out"), (x) => x.a);
  const bal = sum(txs, (x) => (x.t === "in" ? x.a : -x.a));
  const rate = inc ? Math.round(((inc - exp) / inc) * 100) : 0;
  const ch = pe ? Math.round(((exp - pe) / pe) * 100) : 0;
  const sp = spendBy(txs, k);
  const top = Object.entries(sp).sort((x, y) => y[1] - x[1])[0];
  const now = new Date();
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const proj = (exp / Math.max(now.getDate(), 1)) * dim;

  const filteredTxs = txs
    .filter((x) => (x.n + x.c).toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => y.d.localeCompare(x.d) || y.id.localeCompare(x.id))
    .slice(0, 30);

  function addTx() {
    if (!+a) return notify("Enter an amount first");
    const newTx: Tx = { id: "demo_" + Date.now(), d: d || new Date().toLocaleDateString("en-CA"), t, c: t === "in" ? "Income" : c, n: n.trim() || (t === "in" ? "Income" : c), a: +a };
    setTxs((prev) => [newTx, ...prev]);
    setA(""); setN("");
    notify("Added to live demo ✓ Check Overview to see charts update!");
  }

  function simulateVoice() {
    if (simBusy) return;
    setSimBusy("voice");
    notify("🎙️ Listening: “I spent 42 bucks on gas today”...");
    setTimeout(() => {
      setT("out"); setA("42"); setC("Transport"); setN("Gas"); setD(new Date().toLocaleDateString("en-CA"));
      setSimBusy(null); notify("Filled from Gemini AI Voice ✓ Tap Add!");
    }, 1100);
  }

  function simulateReceipt() {
    if (simBusy) return;
    setSimBusy("receipt");
    notify("📸 Scanning sample Whole Foods receipt...");
    setTimeout(() => {
      setT("out"); setA("64.50"); setC("Food"); setN("Whole Foods Market"); setD(new Date().toLocaleDateString("en-CA"));
      setSimBusy(null); notify("Extracted from Receipt Photo ✓ Tap Add!");
    }, 1200);
  }

  function triggerRoast() {
    if (roastBusy) return;
    setRoastBusy(true);
    setTimeout(() => {
      setRoastIdx((i) => (i + 1) % DEMO_ROASTS.length);
      setRoastBusy(false); notify("💀 Fresh AI roast generated!");
    }, 750);
  }

  return (
    <section className="wrap sandbox-sec" aria-label="Interactive Live Demo">
      <div className="sandbox-head">
        <span className="eyebrow">Interactive Sandbox · No Login Required</span>
        <p className="sandbox-hint">
          Click around—add expenses, adjust budgets, fund goals, or test the AI buttons right here.
        </p>
      </div>

      <div ref={containerRef} className="sandbox-shell">
        <div className="sandbox-chrome">
          <div className="chrome-dots" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="chrome-url mono">
            <span className="live" /> mypenny.net/dashboard — Live Interactive Preview
          </div>
          <button type="button" className="chrome-replay mono" onClick={() => setGlassPhase("visible")} title="Replay intro">
            ✦ Replay Intro
          </button>
        </div>

        {glassPhase !== "gone" && (
          <div className={`liquid-veil ${glassPhase === "visible" ? "is-in" : ""} ${glassPhase === "fading" ? "is-out" : ""}`} onClick={() => setGlassPhase("gone")}>
            <div className="liquid-center">
              <img 
                src="/glass-text.png" 
                alt="Welcome to your first experience." 
                className="liquid-img"
              />
              <span className="liquid-sub mono">Interactive Sandbox · Ready in a moment</span>
            </div>
          </div>
        )}

        <div className="sandbox-app">
          <div className="top">
            <div className="logo">Penny<i>.</i></div>
            <nav>
              {TABS.map(([k, label]) => (
                <button key={k} className={k === view ? "on" : ""} onClick={() => setView(k)}>{label}</button>
              ))}
            </nav>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <select value={cur} onChange={(e) => setCur(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "6px 10px", borderRadius: "0.6rem" }}>
                {CURRENCIES.map((c) => (<option key={c}>{c}</option>))}
              </select>
              <button type="button" className="s" onClick={() => {
                  if (!restored) { setStreak(15); setRestored(true); notify("🔥 Streak restored to 15! (Monthly restore used)"); }
                  else { notify(`🔥 ${streak}-day streak active!`); }
                }}>
                🔥 {streak} {!restored && "· Restore (15)"}
              </button>
              <Link href="/dashboard" className="p" style={{ textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "0.75rem" }}>Save My Data →</Link>
            </div>
          </div>

          <div className="sandbox-body">
            {view === "ov" && (
              <>
                <div className="grid g4">
                  <div className="card hero" style={{ padding: "1.5rem" }}>
                    <h3>Total balance</h3>
                    <div className="big">{f(bal)}</div>
                    <div className="sub">All accounts</div>
                  </div>
                  <div className="card">
                    <h3>Income</h3>
                    <div className="big pos">{f(inc)}</div>
                    <div className="sub">This month</div>
                  </div>
                  <div className="card">
                    <h3>Spending</h3>
                    <div className="big">{f(exp)}</div>
                    <div className={"sub " + (ch > 0 ? "neg" : "pos")}>{ch > 0 ? "▲" : "▼"} {Math.abs(ch)}% vs last month</div>
                  </div>
                  <div className="card">
                    <h3>Savings rate</h3>
                    <div className={"big " + (rate >= 0 ? "pos" : "neg")}>{rate}%</div>
                    <div className="sub">Of income kept</div>
                  </div>
                </div>

                <div className="grid g2" style={{ marginTop: 14 }}>
                  <div className="card"><h3>Spending by category</h3><Donut data={sp} f={f} /></div>
                  <div className="card"><h3>Last 6 months</h3><Bars txs={txs} /></div>
                </div>

                <div className="grid g2" style={{ marginTop: 14 }}>
                  <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <h3>✨ Smart insights</h3>
                    <div className="grid" style={{ gap: 12, marginTop: 8 }}>
                      <div>📌 Biggest expense: <b>{top ? top[0] : "—"}</b> ({f(top ? top[1] : 0)}, {top ? Math.round((top[1] / Math.max(exp, 1)) * 100) : 0}% of total).</div>
                      <div>📈 Month-end projection: <b>{f(proj)}</b> {inc ? <>(Leaving <b className={inc - proj >= 0 ? "pos" : "neg"}>{f(inc - proj)}</b>)</> : null}.</div>
                      <div>{ch > 10 ? `⚠️ Spending is up ${ch}% versus last month.` : "✅ Spending is controlled versus last month."}</div>
                    </div>
                  </div>

                  <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3>💀 AI Roast</h3>
                      <p className="roast" style={{ margin: "8px 0 16px" }}>{DEMO_ROASTS[roastIdx]}</p>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <button className="p" onClick={triggerRoast} disabled={roastBusy}>{roastBusy ? "💀 Sharpening insults..." : "💀 Roast me again"}</button>
                      <Link href="/dashboard" className="s" style={{ textDecoration: "none", border: "none", background: "transparent" }}>Roast My Real Spending →</Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {view === "tx" && (
              <>
                <div className="card">
                  <h3>Add transaction (Try it live!)</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    <button type="button" className="s" onClick={simulateVoice} title="Simulate Gemini Voice Input" style={{ fontSize: 18, padding: "0 10px", minHeight: 40 }}>{simBusy === "voice" ? "⏳" : "🎙️"}</button>
                    <button type="button" className="s" onClick={simulateReceipt} title="Simulate Gemini Receipt Scan" style={{ fontSize: 18, padding: "0 10px", minHeight: 40 }}>{simBusy === "receipt" ? "⏳" : "📸"}</button>
                    
                    <select value={t} onChange={(e) => setT(e.target.value as "in" | "out")} style={{ padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", minHeight: 40 }}>
                      <option value="out">Expense</option>
                      <option value="in">Income</option>
                    </select>
                    
                    <input type="number" min="0" placeholder="Amount" value={a} onChange={(e) => setA(e.target.value)} style={{ width: 100, padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", minHeight: 40 }} />
                    
                    <select value={c} onChange={(e) => setC(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", minHeight: 40 }}>
                      {Object.keys(C).map((cat) => (<option key={cat}>{cat}</option>))}
                    </select>
                    
                    <input placeholder="Note (e.g. Coffee)" value={n} onChange={(e) => setN(e.target.value)} style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", minHeight: 40 }} />
                    
                    <input type="date" value={d} onChange={(e) => setD(e.target.value)} style={{ width: 140, padding: "8px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", minHeight: 40 }} />
                    
                    <button className="p" onClick={addTx} style={{ minHeight: 40, padding: "0 20px" }}>Add</button>
                  </div>
                  <p className="sub" style={{ margin: "12px 0 0" }}>💡 Tap 🎙️ or 📸 above to test how Gemini AI auto-fills transactions, or type any expense and click Add!</p>
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <input placeholder="Search demo transactions…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "0.5rem 1rem", borderRadius: "0.5rem" }} />
                    <button className="s" onClick={() => { navigator.clipboard?.writeText("date,type,category,note,amount\n" + txs.map((x) => [x.d, x.t, x.c, `"${x.n}"`, x.a].join(",")).join("\n")); notify("CSV copied to clipboard ✓"); }}>Copy CSV</button>
                  </div>
                  {filteredTxs.map((x) => (
                    <div className="tx" key={x.id}>
                      <div className="dot" style={{ background: C[x.c] || "var(--ok)" }}>{x.c[0]}</div>
                      <div className="m"><b>{x.n || x.c}</b><span className="sub">{x.c} · {x.d}</span></div>
                      <b className={x.t === "in" ? "pos" : ""}>{x.t === "in" ? "+" : "−"}{f(x.a)}</b>
                      <button className="x" onClick={() => { setTxs((prev) => prev.filter((item) => item.id !== x.id)); notify("Deleted from demo"); }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {view === "bd" && (
              <div className="card">
                <h3>Monthly budgets (Edit any number below)</h3>
                {Object.keys(C).map((cat) => {
                  const limit = budgets[cat] || 0; const spent = sp[cat] || 0; const pct = limit ? (spent / limit) * 100 : 0;
                  return (
                    <div key={cat} style={{ margin: "14px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <b>{cat}</b>
                        <span className="sub">{f(spent)} of <input type="number" value={limit} onChange={(e) => setBudgets((prev) => ({ ...prev, [cat]: Math.max(0, +e.target.value) }))} style={{ width: 90, padding: "4px 8px", background: "var(--bg)", border: "1px solid var(--bd)", color: "var(--tx)", borderRadius: 6 }} /></span>
                      </div>
                      <div className="bar"><i style={{ width: Math.min(pct, 100) + "%", background: pct > 100 ? "var(--bad)" : pct > 80 ? "#f59e0b" : C[cat] }} /></div>
                      {pct > 100 && <span className="sub neg">Over budget by {f(spent - limit)}</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {view === "gl" && (
              <div className="grid g2">
                {goals.map((g) => {
                  const pct = Math.min(100, (g.s / Math.max(g.t, 1)) * 100); const val = goalInputs[g.id] ?? "";
                  return (
                    <div className="card" key={g.id}>
                      <h3>{g.n}</h3>
                      <div className="big">{f(g.s)} <span className="sub">of {f(g.t)}</span></div>
                      <div className="bar"><i style={{ width: pct + "%", background: "linear-gradient(90deg,var(--ac),var(--ac2))" }} /></div>
                      <div className="sub">{Math.round(pct)}% there</div>
                      <div className="form" style={{ marginTop: 10 }}>
                        <input type="number" placeholder="Add funds" value={val} onChange={(e) => setGoalInputs((prev) => ({ ...prev, [g.id]: e.target.value }))} />
                        <button className="s" onClick={() => { if (+val > 0) { setGoals((prev) => prev.map((item) => (item.id === g.id ? { ...item, s: item.s + +val } : item))); setGoalInputs((prev) => ({ ...prev, [g.id]: "" })); notify(`Added ${f(+val)} to ${g.n} ✓`); } }}>Add</button>
                        <button className="x" onClick={() => { setGoals((prev) => prev.filter((item) => item.id !== g.id)); notify("Goal removed"); }}>✕</button>
                      </div>
                    </div>
                  );
                })}
                <div className="card">
                  <h3>New goal</h3>
                  <div className="form">
                    <input placeholder="Goal name" value={gn} onChange={(e) => setGn(e.target.value)} />
                    <input type="number" placeholder="Target amount" value={gt} onChange={(e) => setGt(e.target.value)} />
                    <button className="p" onClick={() => { if (gn.trim() && +gt > 0) { setGoals((prev) => [...prev, { id: "g_" + Date.now(), n: gn.trim(), t: +gt, s: 0 }]); setGn(""); setGt(""); notify("New goal created ✓"); } }}>Create</button>
                  </div>
                </div>
              </div>
            )}

            {view === "pr" && (
              <div className="card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
                <h3>Ready to make it yours?</h3>
                <div className="big" style={{ margin: "8px 0" }}>Save your real finances in Penny.</div>
                <p className="sub" style={{ maxWidth: 460, margin: "0 auto 20px" }}>You&apos;re currently playing in the live sandbox. Create your free account in 10 seconds to get 5 free Gemini AI scans, 1 free AI Roast, and unlimited tracking forever.</p>
                <Link href="/dashboard" className="p" style={{ display: "inline-block", textDecoration: "none", padding: "12px 26px", fontSize: 16 }}>Create Free Account →</Link>
              </div>
            )}
          </div>

          {toast && <div className="sandbox-toast">{toast}</div>}
        </div>
      </div>
    </section>
  );
}