"use client";
import Link from "next/link";
import { FREE_AI_LIMIT } from "@/lib/limits";
import { useUsage } from "@/lib/useUsage";
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

const roastBoxStyle: React.CSSProperties = {
  margin: 0,
  padding: "12px 14px",
  borderLeft: "3px solid var(--ac2)",
  background: "var(--bg)",
  borderRadius: "0 10px 10px 0",
  fontSize: 16,
  lineHeight: 1.5,
};

function monthSummary(txs: Tx[]) {
  const k = ym(0);
  const m = mTx(txs, k);
  const income = sum(m.filter((x) => x.t === "in"), (x) => x.a);
  const out = m.filter((x) => x.t === "out");
  const expenses = sum(out, (x) => x.a);
  const top = Object.entries(spendBy(txs, k)).sort((a, b) => b[1] - a[1])[0];

  const seen = new Set<string>();
  const notes: string[] = [];
  for (const x of [...out].sort((a, b) => b.a - a.a)) {
    const n = (x.n || "").trim();
    const key = n.toLowerCase();
    if (n && !seen.has(key)) {
      seen.add(key);
      notes.push(n.slice(0, 40));
      if (notes.length >= 10) break;
    }
  }
  return {
    income: Math.round(income),
    expenses: Math.round(expenses),
    top: top ? { c: top[0], a: Math.round(top[1]) } : null,
    notes,
  };
}

function RoastCard({ txs, f, isPro, onUpgrade }: { txs: Tx[]; f: Fmt } & Gate) {
  const [roast, setRoast] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useUsage(isPro);
  const currency = f(0).replace(/0$/, "");

  const left = usage?.roastLeft ?? 0;
  const exhausted = !isPro && left <= 0;
  const open = isPro || left > 0 || !!roast;

  async function go() {
    if (busy) return;
    if (exhausted) return onUpgrade();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...monthSummary(txs), currency }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.status === 402) {
        setUsage((u) => ({ aiLeft: u?.aiLeft ?? 0, roastLeft: 0 }));
        onUpgrade();
        return;
      }
      if (!r.ok) return setErr(j.error ?? "Couldn't roast you this time.");
      setRoast(j.roast);
      if (typeof j.roastLeft === "number") {
        const rl = j.roastLeft;
        setUsage((u) => ({ aiLeft: u?.aiLeft ?? 0, roastLeft: rl }));
      }
    } catch {
      setErr("Couldn't reach the roast machine.");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const text = `${roast}\n\nRoasted by Penny 💀 ${location.origin}`;
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 130, position: "relative", overflow: "hidden" }}>
      <div>
        <h3>💀 AI Roast</h3>
        {open ? (
          <>
            {roast && <p className="roast" style={{ margin: "8px 0 16px" }}>{roast}</p>}
            {err && <p className="sub neg" role="alert" style={{ margin: "10px 0 0" }}>{err}</p>}
            {!roast && !err && !busy && (
              <p className="sub" style={{ margin: "8px 0 16px" }}>
                Penny reads this month's spending and verbally destroys your financial choices.
              </p>
            )}
          </>
        ) : (
          <p className="roast" style={{ filter: "blur(5px)", userSelect: "none", opacity: 0.6, margin: "8px 0 16px" }}>
            You spent $140 on DoorDash this week but your fridge is full of rotting spinach. Your 'budget' is just vibes and denial. 
          </p>
        )}
      </div>

      {open ? (
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="p" onClick={go} disabled={busy} style={{ flex: "0 0 auto", opacity: busy ? 0.7 : 1 }}>
              {busy ? "💀 Loading insults..." : roast ? `💀 Roast me again${exhausted ? " 🔒" : ""}` : "💀 Roast my spending"}
            </button>
            {roast && (
              <button className="s" onClick={share} style={{ flex: "0 0 auto" }}>
                {copied ? "Copied ✓" : "Share to IG"}
              </button>
            )}
          </div>
          {!isPro && usage && (
            <p className="sub" style={{ margin: "10px 0 0", color: left > 0 ? "var(--ok)" : "var(--tx)" }}>
              {left > 0 ? `🔥 You have ${left} free roast remaining. Make it count.` : "🔒 Free roast used. Go Pro to keep getting yelled at."}
            </p>
          )}
        </div>
      ) : (
        <div className="lock" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "100%", background: "transparent", padding: 0 }}>
          <b style={{ fontSize: "18px" }}>🔒 Pro Feature</b>
          <p className="sub" style={{ margin: "4px 0 12px" }}>Get unlimited roasts of your actual spending.</p>
          <button className="p" onClick={onUpgrade} style={{ padding: "6px 16px", margin: "0 auto", display: "block" }}>Unlock for $19</button>
        </div>
      )}
    </div>
  );
}

// Picks a size class for big numbers so long values ($1,116,298 / TND 12,116,298) still fit the square mobile tiles
const fit = (s: string) => (s.length <= 7 ? "" : s.length <= 9 ? " fit-m" : s.length <= 11 ? " fit-s" : " fit-xs");

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
        <div className="card stat hero">
          <h3>Total balance</h3>
          <div className={"big" + fit(f(bal))}>{f(bal)}</div>
          <div className="sub">All accounts</div>
        </div>
        <div className="card stat">
          <h3>Income</h3>
          <div className={"big pos" + fit(f(inc))}>{f(inc)}</div>
          <div className="sub">This month</div>
        </div>
        <div className="card stat">
          <h3>Spending</h3>
          <div className={"big" + fit(f(exp))}>{f(exp)}</div>
          <div className={"sub " + (ch > 0 ? "neg" : "pos")}>{ch > 0 ? "▲" : "▼"} {Math.abs(ch)}% vs last month</div>
        </div>
        <div className="card stat">
          <h3>Savings rate</h3>
          <div className={"big " + (rate >= 0 ? "pos" : "neg") + fit(`${rate}%`)}>{rate}%</div>
          <div className="sub">Of income kept</div>
        </div>
      </div>
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card"><h3>Spending by category</h3><Donut data={sp} f={f} /></div>
        <div className="card"><h3>Last 6 months</h3><Bars txs={txs} /></div>
      </div>
      
      {/* Wrapped Insights and Roast into a 2-Column Grid */}
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <h3>✨ Smart insights</h3>
          {isPro ? (
            <div className="grid" style={{ gap: 12, marginTop: 8 }}>
              <div>📌 Biggest expense: <b>{top ? top[0] : "—"}</b> ({f(top ? top[1] : 0)}, {top ? Math.round((top[1] / Math.max(exp, 1)) * 100) : 0}% of spending).</div>
              <div>📈 Month-end projection: <b>{f(proj)}</b> {inc ? <>(Leaving <b className={inc - proj >= 0 ? "pos" : "neg"}>{f(inc - proj)}</b>)</> : null}.</div>
              <div>{ch > 10 ? `⚠️ Spending is up ${ch}% versus last month.` : "✅ Spending is controlled versus last month."}</div>
            </div>
          ) : (
            <>
              <div style={{ filter: "blur(4px)", marginTop: 8 }}>Your biggest category is Food. At this pace you&apos;ll spend more than last month.</div>
              <Lock onUpgrade={onUpgrade} />
            </>
          )}
        </div>
        <RoastCard txs={txs} f={f} isPro={isPro} onUpgrade={onUpgrade} />
      </div>
    </>
  );
}

export function Transactions({ txs, f, isPro, onUpgrade, onAdd, onDelete, notify }: {
  txs: Tx[]; f: Fmt; onAdd: (x: Omit<Tx, "id">) => Promise<void>; onDelete: (id: string) => void; notify: (m: string) => void;
} & Gate) {
  const [t, setT] = useState<"in" | "out">("out");
  const [a, setA] = useState(""); const [c, setC] = useState("Food");
  const [n, setN] = useState(""); 
  const [d, setD] = useState("");
  const [q, setQ] = useState("");
  const [listening, setListening] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [usage, setUsage] = useUsage(isPro);
  const recRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    // Setup initial date on client to avoid hydration mismatch and UTC desync
    setD(new Date().toLocaleDateString("en-CA"));
  }, []);

  const outOfCredits = !isPro && usage !== null && usage.aiLeft <= 0;

  useEffect(() => () => { 
    if (recRef.current) {
      try { recRef.current.abort(); } catch {}
      recRef.current = null;
    }
  }, []);

  const list = txs.filter((x) => (x.n + x.c).toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => y.d.localeCompare(x.d) || y.id.localeCompare(x.id)).slice(0, 60);

  const localToday = () => new Date().toLocaleDateString("en-CA");

  function paywall() {
    notify("🤖 Compute isn't free. You've hit your limit! Unlock Lifetime Pro for $19.");
    onUpgrade();
  }

  function handleLimit() {
    setUsage((u) => ({ aiLeft: 0, roastLeft: u?.roastLeft ?? 0 }));
    paywall();
  }

  async function add() {
    if (!+a) return notify("Enter an amount");
    await onAdd({ d: d || localToday(), t, c: t === "in" ? "Income" : c, n, a: +a });
    setA(""); setN(""); notify("Added ✓");
  }

  function csv() {
    if (!isPro) return onUpgrade();
    const s = "date,type,category,note,amount\n" + txs.map((x) => [x.d, x.t, x.c, `"${x.n}"`, x.a].join(",")).join("\n");
    navigator.clipboard.writeText(s).then(() => notify("CSV copied"), () => notify("Copy not allowed"));
  }

  function applyParsed(j: { t: "in" | "out"; a: number; c: string; n: string; d: string; aiLeft?: number }, source: string) {
    setT(j.t); setA(String(j.a)); setN(j.n); setD(j.d);
    if (j.t === "out") setC(j.c);
    if (typeof j.aiLeft === "number") {
      const left = j.aiLeft;
      setUsage((u) => ({ aiLeft: left, roastLeft: u?.roastLeft ?? 0 }));
    }
    notify(`Filled from ${source} ✓ Review, then tap Add`);
  }

  async function parseSpeech(text: string) {
    setParsing(true);
    try {
      const r = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, today: localToday() }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.status === 402) return handleLimit();
      if (!r.ok) return notify(j.error ?? "Couldn't understand that");
      applyParsed(j, "voice");
    } catch {
      notify("Couldn't reach the voice service");
    } finally {
      setParsing(false);
    }
  }

  function mic() {
    if (outOfCredits) return paywall();
    
    if (listening && recRef.current) { 
      try { recRef.current.stop(); } catch {} 
      return; 
    }
    if (parsing || scanning) return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return notify("Voice input isn't supported in this browser. Try Chrome or Safari.");

    const r = new SR();
    r.lang = navigator.language || "en-US";
    r.interimResults = false;
    r.continuous = true;
    r.maxAlternatives = 1;
    transcriptRef.current = "";
    
    r.onstart = () => setListening(true);
    
    r.onend = () => {
      setListening(false);
      const fullText = transcriptRef.current.trim();
      if (fullText) parseSpeech(fullText);
      try { r.abort(); } catch {} 
      recRef.current = null;
    };
    
    r.onerror = (e: any) => {
      if (e.error === "no-speech") return; 
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

  async function toBase64(file: File): Promise<string> {
    const MAX = 1600;
    let src: ImageBitmap | HTMLImageElement;
    let url = "";
    try {
      src = await createImageBitmap(file);
    } catch {
      url = URL.createObjectURL(file);
      src = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => rej(new Error("decode"));
        img.src = url;
      });
    }
    try {
      const w = "naturalWidth" in src ? src.naturalWidth : src.width;
      const h = "naturalHeight" in src ? src.naturalHeight : src.height;
      const s = Math.min(1, MAX / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * s);
      canvas.height = Math.round(h * s);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.82).split(",")[1];
    } finally {
      if (url) URL.revokeObjectURL(url);
      if ("close" in src) src.close();
    }
  }

  function receipt() {
    if (outOfCredits) return paywall();
    if (parsing || scanning || listening) return;
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; 
    if (!file) return;
    if (!file.type.startsWith("image/")) return notify("Please choose an image");
    if (file.size > 25 * 1024 * 1024) return notify("That image is too large");

    setScanning(true);
    setParsing(true);
    try {
      let image: string;
      try { image = await toBase64(file); }
      catch { return notify("Couldn't read that image. Try a JPG or PNG."); }

      const r = await fetch("/api/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mime: "image/jpeg", today: localToday() }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.status === 402) return handleLimit();
      if (!r.ok) return notify(j.error ?? "Couldn't read that receipt");
      applyParsed(j, "receipt");
    } catch {
      notify("Couldn't reach the scanner");
    } finally {
      setScanning(false);
      setParsing(false);
    }
  }

  return (
    <>
      <div className="card">
        <h3>Add transaction</h3>
        <div className="form txform">
          <div className="txform-actions">
            <button
              type="button"
              className={"s txbtn mic" + (listening ? " rec" : "")}
              onClick={mic}
              disabled={parsing}
              aria-label={listening ? "Stop recording" : "Log by voice"}
              title={outOfCredits ? "Voice logging (Pro)" : "Log by voice"}
            >
              <span className="ico">{parsing && !scanning ? "⏳" : listening ? "🔴" : outOfCredits ? "🎙️🔒" : "🎙️"}</span>
              <span className="lbl">{listening ? "Stop" : "Voice"}</span>
            </button>
            <button
              type="button"
              className="s txbtn"
              onClick={receipt}
              disabled={parsing || listening}
              aria-label="Scan a receipt"
              title={outOfCredits ? "Receipt scanner (Pro)" : "Scan a receipt"}
            >
              <span className="ico">{scanning ? "📸⏳" : outOfCredits ? "📸🔒" : "📸"}</span>
              <span className="lbl">{scanning ? "Reading…" : "Scan receipt"}</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />

          <select className="f-type" aria-label="Type" value={t} onChange={(e) => setT(e.target.value as "in" | "out")}>
            <option value="out">Expense</option>
            <option value="in">Income</option>
          </select>

          <input className="f-amt" type="number" inputMode="decimal" min="0" placeholder="Amount" aria-label="Amount" value={a} onChange={(e) => setA(e.target.value)} />

          <select className="f-cat" aria-label="Category" value={c} onChange={(e) => setC(e.target.value)}>
            {Object.keys(C).map((k) => <option key={k}>{k}</option>)}
          </select>

          <input className="f-note" placeholder="Note (e.g. Coffee)" aria-label="Note" value={n} onChange={(e) => setN(e.target.value)} />

          <input className="f-date" type="date" aria-label="Date" value={d} onChange={(e) => setD(e.target.value)} />

          <button className="p f-add" onClick={add}>Add</button>
        </div>
        
        <p className="sub" style={{ margin: "12px 0 0" }}>
          {listening ? "Listening… speak, then tap the mic again to stop 🔴" :
           scanning ? "Reading your receipt…" :
           parsing ? "Understanding what you said…" :
           "🎙️ Say “I spent 40 bucks on gas yesterday”  ·  📸 or snap a photo of a receipt"}
        </p>
        
        {!isPro && usage && (
          <div className="sub" style={{ margin: "12px 0 0", padding: "10px", background: "rgba(217, 179, 91, 0.12)", borderRadius: "8px", border: "1px solid rgba(217, 179, 91, 0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>⚡ <b>{usage.aiLeft} of {FREE_AI_LIMIT}</b> free AI actions left</span>
              {usage.aiLeft === 0 ? (
                <Link href="/dashboard" className="p" style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>Unlock Pro</Link>
              ) : (
                <span style={{ fontSize: "12px", opacity: 0.7 }}>Lifetime Pro: $19</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="card" style={{ marginTop: 14 }}>
        <div className="txbar">
          <input placeholder="Search…" aria-label="Search transactions" value={q} onChange={(e) => setQ(e.target.value)} />
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
                onBlur={(e) => +e.target.value !== l && onSave(c, +e.target.value)} className="bd-input" inputMode="decimal" aria-label={`${c} budget`} /></span>
            </div>
            <div className="bar"><i style={{ width: Math.min(p, 100) + "%", background: p > 100 ? "var(--bad)" : p > 80 ? "var(--warn)" : C[c] }} /></div>
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
      <div className="form goalform" style={{ marginTop: 10 }}>
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
          <div className="form stackform">
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
