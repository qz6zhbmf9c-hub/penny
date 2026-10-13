"use client";
import { useEffect, useRef, useState } from "react";
import { Bars, Donut } from "./Charts";
import { Budgets, C, Goal, Tx, mTx, spendBy, sum, ym } from "@/lib/penny";

type Fmt = (n: number) => string;
type Gate = { isPro: boolean; onUpgrade: () => void };

function Lock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="lock">
      <b>🔒 Pro feature</b>
      <span className="sub">Unlock budgets, goals, insights &amp; export</span>
      <button className="p" onClick={onUpgrade}>Upgrade</button>
    </div>
  );
}

export function Overview({ txs, f, isPro, onUpgrade }: { txs: Tx[]; f: Fmt } & Gate) {
  const k = ym(0), p = ym(1);
  const inc = sum(mTx(txs, k).filter((x) => x.t === "in"), (x) => x.a);
  const exp = sum(mTx(txs, k).filter((x) => x.t === "out"), (x) => x.a);
  const pe = sum(mTx(txs, p).filter((x) => x.t === "out"), (x) => x.a);
  const bal = sum(txs, (x) => (x.t === "in" ? x.a : -x.a));
  const rate = inc ? Math.round(((inc - exp) / inc) * 100) : 0;
  const ch = pe ? Math.round(((exp - pe) / pe) * 100) : 0;
  const sp = spendBy(txs, k), top = Object.entries(sp).sort((a, b) => b[1] - a[1])[0];
  const now = new Date(), dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const proj = (exp / Math.max(now.getDate(), 1)) * dim;
  
  return (
    <>
      <div className="grid g4">
        <div className="card hero"><h3>Total balance</h3><div className="big">{f(bal)}</div><div className="sub">All accounts</div></div>
        <div className="card"><h3>Income</h3><div className="big pos">{f(inc)}</div><div className="sub">This month</div></div>
        <div className="card"><h3>Spending</h3><div className="big">{f(exp)}</div><div className={"sub " + (ch > 0 ? "neg" : "pos")}>{ch > 0 ? "▲" : "▼"} {Math.abs(ch)}% vs last month</div></div>
        <div className="card"><h3>Savings rate</h3><div className={"big " + (rate >= 0 ? "pos" : "neg")}>{rate}%</div><div className="sub">Of income kept</div></div>
      </div>
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card"><h3>Spending by category</h3><Donut data={sp} f={f} /></div>
        <div className="card"><h3>Last 6 months</h3><Bars txs={txs} /></div>
      </div>
      <div className="card" style={{ marginTop: 14, minHeight: 130 }}>
        <h3>✨ Smart insights</h3>
        {isPro ? (
          <div className="grid" style={{ gap: 8 }}>
            <div>📌 Your biggest category is <b>{top ? top[0] : "—"}</b> ({f(top ? top[1] : 0)}, {top ? Math.round((top[1] / Math.max(exp, 1)) * 100) : 0}% of spending).</div>
            <div>📈 At this pace you&apos;ll spend <b>{f(proj)}</b> by month end{inc ? <> — leaving <b className={inc - proj >= 0 ? "pos" : "neg"}>{f(inc - proj)}</b></> : null}.</div>
            <div>{ch > 10 ? `⚠️ Spending is up ${ch}% versus last month.` : "✅ Spending is stable versus last month."}</div>
          </div>
        ) : (
          <>
            <div style={{ filter: "blur(4px)" }}>Your biggest category is Food. At this pace you&apos;ll spend more than last month.</div>
            <Lock onUpgrade={onUpgrade} />
          </>
        )}
      </div>
    </>
  );
}

export function Transactions({ txs, f, isPro, onUpgrade, onAdd, onDelete, notify }: {
  txs: Tx[]; f: Fmt; onAdd: (x: Omit<Tx, "id">) => Promise<void>; onDelete: (id: string) => void; notify: (m: string) => void;
} & Gate) {
  const [t, setT] = useState<"in" | "out">("out");
  const [a, setA] = useState(""); const [c, setC] = useState("Food");
  const [n, setN] = useState(""); const [d, setD] = useState(new Date().toISOString().slice(0, 10));
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);
  const [parsing, setParsing] = useState(false);
  const recRef = useRef<any>(null);
  const transcriptRef = useRef(""); // Stores the spoken words while continuous listening is active

  // Aggressive cleanup on unmount
  useEffect(() => () => { 
    if (recRef.current) {
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
  }, []);

  const list = txs.filter((x) => (x.n + x.c).toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => y.d.localeCompare(x.d) || y.id.localeCompare(x.id)).slice(0, 60);

  async function add() {
    if (!+a) return notify("Enter an amount");
    await onAdd({ d, t, c: t === "in" ? "Income" : c, n, a: +a });
    setA(""); setN(""); notify("Added ✓");
  }

  function csv() {
    if (!isPro) return onUpgrade();
    const s = "date,type,category,note,amount\n" + txs.map((x) => [x.d, x.t, x.c, `"${x.n}"`, x.a].join(",")).join("\n");
    navigator.clipboard.writeText(s).then(() => notify("CSV copied"), () => notify("Copy not allowed"));
  }

  async function parseSpeech(text: string) {
    setParsing(true);
    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const r = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, today }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return notify(j.error ?? "Couldn't understand that");
      setT(j.t); setA(String(j.a)); setN(j.n); setD(j.d);
      if (j.t === "out") setC(j.c);
      notify("Filled from voice ✓ Review, then tap Add");
    } catch {
      notify("Couldn't reach the voice service");
    } finally {
      setParsing(false);
    }
  }

  function mic() {
    if (!isPro) {
      notify("🔒 Voice logging is a Pro feature!");
      return;
    }
    
    // If they click while it's already listening, stop recording and process the speech
    if (listening && recRef.current) { 
      try { recRef.current.stop(); } catch {} 
      return; 
    }
    
    if (parsing) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return notify("Voice input isn't supported in this browser. Try Chrome or Safari.");

    const r = new SR();
    r.lang = navigator.language || "en-US";
    r.interimResults = false;
    r.continuous = true; // <--- The magic toggle that keeps it listening through pauses
    r.maxAlternatives = 1;
    transcriptRef.current = ""; // Wipe the slate clean for a new sentence
    
    r.onstart = () => setListening(true);
    
    r.onend = () => {
      setListening(false);
      const fullText = transcriptRef.current.trim();
      if (fullText) parseSpeech(fullText); // Only send to AI if they actually said something
      try { r.abort(); } catch {} // Force Safari to let go of the mic
      recRef.current = null;
    };
    
    r.onerror = (e: any) => {
      if (e.error === "no-speech") return; // Ignore silent pauses now that it's continuous
      setListening(false);
      try { r.abort(); } catch {} 
      recRef.current = null;
      if (e.error !== "aborted") {
        notify(
          e.error === "not-allowed" || e.error === "service-not-allowed" ? "Microphone access is blocked" : "Voice input failed"
        );
      }
    };
    
    r.onresult = (e: any) => {
      // Because continuous=true, we need to gather all the separate phrases they spoke
      let currentText = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          currentText += e.results[i][0].transcript + " ";
        }
      }
      transcriptRef.current += currentText;
    };
    
    recRef.current = r;
    try { r.start(); } catch { notify("Voice input failed to start"); }
  }

  return (
    <>
      <div className="card">
        <h3>Add transaction</h3>
        <div className="form">
          <button
            type="button"
            className={"s mic" + (listening ? " rec" : "")}
            onClick={mic}
            disabled={parsing}
            aria-label={listening ? "Stop recording" : "Log by voice"}
            title={isPro ? "Log by voice" : "Voice logging (Pro)"}
            style={{ flex: "0 0 auto", fontSize: 18 }}
          >
            {parsing ? "⏳" : listening ? "🔴" : isPro ? "🎙️" : "🎙️🔒"}
          </button>
          <select value={t} onChange={(e) => setT(e.target.value as "in" | "out")}><option value="out">Expense</option><option value="in">Income</option></select>
          <input type="number" min="0" placeholder="Amount" value={a} onChange={(e) => setA(e.target.value)} />
          <select value={c} onChange={(e) => setC(e.target.value)}>{Object.keys(C).map((k) => <option key={k}>{k}</option>)}</select>
          <input placeholder="Note" value={n} onChange={(e) => setN(e.target.value)} />
          <input type="date" value={d} onChange={(e) => setD(e.target.value)} />
          <button className="p" onClick={add}>Add</button>
        </div>
        <p className="sub" style={{ margin: "8px 0 0" }}>
          {listening ? "Listening… speak, then tap the mic again to stop 🔴" :
           parsing ? "Understanding what you said…" :
           "🎙️ Tip: tap the mic and say “I spent 40 bucks on gas yesterday”"}
        </p>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} />
          <button className="s" onClick={csv}>Copy CSV{isPro ? "" : " 🔒"}</button>
        </div>
        {list.length ? list.map((x) => (
          <div className="tx" key={x.id}>
            <div className="dot" style={{ background: C[x.c] || "var(--ok)" }}>{x.c[0]}</div>
            <div className="m"><b>{x.n || x.c}</b><span className="sub">{x.c} · {x.d}</span></div>
            <b className={x.t === "in" ? "pos" : ""}>{x.t === "in" ? "+" : "−"}{f(x.a)}</b>
            <button className="x" onClick={() => onDelete(x.id)}>✕</button>
          </div>
        )) : <p className="sub">Nothing here yet. Add your first transaction above.</p>}
      </div>
    </>
  );
}

export function BudgetsView({ txs, budgets, f, isPro, onUpgrade, onSave }: {
  txs: Tx[]; budgets: Budgets; f: Fmt; onSave: (c: string, v: number) => void;
} & Gate) {
  const sp = spendBy(txs, ym(0));
  return (
    <div className="card" style={{ minHeight: 300 }}>
      <h3>Monthly budgets</h3>
      {Object.keys(C).map((c) => {
        const l = budgets[c] || 0, s = sp[c] || 0, p = l ? (s / l) * 100 : 0;
        return (
          <div key={c} style={{ margin: "12px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <b>{c}</b>
              <span className="sub">{f(s)} of <input key={l} type="number" defaultValue={l} disabled={!isPro}
                onBlur={(e) => +e.target.value !== l && onSave(c, +e.target.value)} style={{ width: 84, padding: "4px 6px" }} /></span>
            </div>
            <div className="bar"><i style={{ width: Math.min(p, 100) + "%", background: p > 100 ? "var(--bad)" : p > 80 ? "#f59e0b" : C[c] }} /></div>
            {p > 100 && <span className="sub neg">Over budget by {f(s - l)}</span>}
          </div>
        );
      })}
      {!isPro && <Lock onUpgrade={onUpgrade} />}
    </div>
  );
}

function GoalCard({ g, f, onFund, onDelete }: { g: Goal; f: Fmt; onFund: (id: string, v: number) => void; onDelete: (id: string) => void }) {
  const [v, setV] = useState(""); const p = Math.min(100, (g.s / g.t) * 100);
  return (
    <div className="card">
      <h3>{g.n}</h3>
      <div className="big">{f(g.s)} <span className="sub">of {f(g.t)}</span></div>
      <div className="bar"><i style={{ width: p + "%", background: "linear-gradient(90deg,var(--ac),var(--ac2))" }} /></div>
      <div className="sub">{Math.round(p)}% there</div>
      <div className="form" style={{ marginTop: 10 }}>
        <input type="number" placeholder="Add funds" value={v} onChange={(e) => setV(e.target.value)} />
        <button className="s" onClick={() => { if (+v) { onFund(g.id, +v); setV(""); } }}>Add</button>
        <button className="x" onClick={() => onDelete(g.id)}>✕</button>
      </div>
    </div>
  );
}

export function GoalsView({ goals, f, isPro, onUpgrade, onAdd, onFund, onDelete }: {
  goals: Goal[]; f: Fmt; onAdd: (n: string, t: number) => void; onFund: (id: string, v: number) => void; onDelete: (id: string) => void;
} & Gate) {
  const [n, setN] = useState(""); const [t, setT] = useState("");
  return (
    <div style={{ position: "relative", minHeight: 300 }}>
      <div className="grid g2">
        {goals.map((g) => <GoalCard key={g.id} g={g} f={f} onFund={onFund} onDelete={onDelete} />)}
        <div className="card">
          <h3>New goal</h3>
          <div className="form">
            <input placeholder="Goal name" value={n} onChange={(e) => setN(e.target.value)} />
            <input type="number" placeholder="Target" value={t} onChange={(e) => setT(e.target.value)} />
            <button className="p" onClick={() => { if (n && +t) { onAdd(n, +t); setN(""); setT(""); } }}>Create</button>
          </div>
        </div>
      </div>
      {!isPro && <Lock onUpgrade={onUpgrade} />}
    </div>
  );
}