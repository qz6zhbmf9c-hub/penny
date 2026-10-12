"use client";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";

type Profile = {
  name: string | null;
  email: string | null;
  isPro: boolean;
  proSince: string | null;
  hasGoogle: boolean;
  hasPassword: boolean;
};
type Msg = { t: "ok" | "err"; m: string } | null;

async function call(method: string, body?: unknown) {
  const r = await fetch("/api/profile", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j };
}

function Note({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return msg.t === "err" ? (
    <p className="err" role="alert">{msg.m}</p>
  ) : (
    <p className="sub" style={{ color: "var(--ok)", margin: 0 }}>{msg.m}</p>
  );
}

export default function ProfileView() {
  const [p, setP] = useState<Profile | null>(null);
  const [loadErr, setLoadErr] = useState(false);

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState<Msg>(null);
  const [savingName, setSavingName] = useState(false);

  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [savingPw, setSavingPw] = useState(false);

  const [confirm, setConfirm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reason, setReason] = useState("");
  const [delErr, setDelErr] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const { ok, j } = await call("GET");
    if (!ok) return setLoadErr(true);
    setP(j);
    setName(j.name ?? "");
  }
  useEffect(() => { load(); }, []);

  async function saveName() {
    setNameMsg(null); setSavingName(true);
    const { ok, j } = await call("PATCH", { name });
    setSavingName(false);
    if (!ok) return setNameMsg({ t: "err", m: j.error ?? "Could not save." });
    setNameMsg({ t: "ok", m: "Saved ✓" });
    setP((x) => (x ? { ...x, name: j.name } : x));
  }

  async function savePassword(ev: React.FormEvent) {
    ev.preventDefault();
    setPwMsg(null);
    if (nw.length < 8 || nw.length > 72) return setPwMsg({ t: "err", m: "Password must be 8 to 72 characters." });
    setSavingPw(true);
    const { ok, j } = await call("PATCH", p?.hasPassword ? { currentPassword: cur, newPassword: nw } : { newPassword: nw });
    setSavingPw(false);
    if (!ok) return setPwMsg({ t: "err", m: j.error ?? "Could not update the password." });
    setCur(""); setNw("");
    setPwMsg({ t: "ok", m: p?.hasPassword ? "Password updated ✓" : "Password set ✓ You can now sign in with your email too." });
    setP((x) => (x ? { ...x, hasPassword: true } : x));
  }

  async function deleteAccount() {
    if (!rating) return setDelErr("Please choose a rating.");
    setDelErr(""); setDeleting(true);
    const { ok, j } = await call("DELETE", { rating, reason });
    if (!ok) { setDeleting(false); return setDelErr(j.error ?? "Could not delete the account."); }
    await signOut({ callbackUrl: "/dashboard" });
  }

  if (loadErr) return <div className="card"><p className="err">Couldn&apos;t load your profile. Refresh and try again.</p></div>;
  if (!p) return <div className="card"><p className="sub">Loading…</p></div>;

  return (
    <div className="grid" style={{ gap: 14 }}>
      {/* Account info */}
      <div className="card">
        <h3>Account</h3>
        <div className="prow"><span className="sub">Email</span><b style={{ wordBreak: "break-all", textAlign: "right" }}>{p.email}</b></div>
        <div className="prow">
          <span className="sub">Plan</span>
          <span>
            {p.isPro ? <span className="badge pro">✨ Pro</span> : <span className="badge">Free</span>}
            {p.isPro && p.proSince && <span className="sub" style={{ marginLeft: 8 }}>since {new Date(p.proSince).toLocaleDateString()}</span>}
          </span>
        </div>
        <div style={{ marginTop: 12 }} className="field">
          <label className="sub" htmlFor="pname">Name</label>
          <div className="form">
            <input id="pname" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ flex: 1 }} />
            <button className="p" onClick={saveName} disabled={savingName || name.trim() === (p.name ?? "")} style={{ flex: "0 0 auto" }}>
              {savingName ? "Saving…" : "Save"}
            </button>
          </div>
          <Note msg={nameMsg} />
        </div>
      </div>

      {/* Connected accounts */}
      <div className="card">
        <h3>Connected accounts</h3>
        <div className="prow">
          <span>Google</span>
          {p.hasGoogle ? (
            <span className="badge ok">Connected</span>
          ) : (
            <button className="s" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Connect Google</button>
          )}
        </div>
        <div className="prow">
          <span>Email &amp; password</span>
          {p.hasPassword ? <span className="badge ok">Enabled</span> : <span className="badge">Not set up</span>}
        </div>
      </div>

      {/* Password */}
      <div className="card">
        <h3>{p.hasPassword ? "Change password" : "Set a password"}</h3>
        {!p.hasPassword && (
          <p className="sub" style={{ marginTop: 0 }}>
            You signed up with Google. Set a password to also sign in with your email.
          </p>
        )}
        <form className="field" onSubmit={savePassword}>
          {p.hasPassword && (
            <input type="password" required placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
          )}
          <input type="password" required minLength={8} maxLength={72} placeholder="New password (8+ characters)" value={nw} onChange={(e) => setNw(e.target.value)} autoComplete="new-password" />
          <Note msg={pwMsg} />
          <button className="p" type="submit" disabled={savingPw} style={{ opacity: savingPw ? 0.7 : 1 }}>
            {savingPw ? "Saving…" : p.hasPassword ? "Update password" : "Set password"}
          </button>
        </form>
        {p.hasPassword && (
          <p className="sub" style={{ marginBottom: 0 }}>
            Forgot it? Sign out and use “Forgot password?” on the sign-in screen.
          </p>
        )}
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: "color-mix(in srgb, var(--bad) 40%, var(--bd))" }}>
        <h3>Delete account</h3>
        {!confirm ? (
          <>
            <p className="sub" style={{ marginTop: 0 }}>
              This permanently deletes your account, transactions, budgets and goals.
            </p>
            <button className="s" onClick={() => setConfirm(true)} style={{ color: "var(--bad)" }}>Remove account</button>
          </>
        ) : (
          <div className="field">
            <p style={{ margin: 0 }}><b>We&apos;re sorry to see you go.</b> How would you rate Penny?</p>
            <div className="stars" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={"star" + (n <= (hover || rating) ? " on" : "")}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea rows={3} maxLength={1000} placeholder="Why are you leaving?" value={reason} onChange={(e) => setReason(e.target.value)} />
            {p.isPro && (
              <p className="sub" style={{ margin: 0 }}>
                Your Pro access is tied to this account and will be removed with it.
              </p>
            )}
            {delErr && <p className="err" role="alert">{delErr}</p>}
            <div className="form">
              <button className="s" onClick={() => { setConfirm(false); setDelErr(""); }} disabled={deleting}>Cancel</button>
              <button className="danger" onClick={deleteAccount} disabled={deleting || !rating} style={{ opacity: deleting || !rating ? 0.6 : 1 }}>
                {deleting ? "Deleting…" : "Permanently delete account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}