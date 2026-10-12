"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const URL_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "That email is already registered with a password. Sign in with your email below.",
  default: "Sign-in failed. Please try again.",
};

export default function LoginCard() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(URL_ERRORS[e] ?? URL_ERRORS.default);
  }, []);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "up") {
        const r = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) return setErr(j.error ?? "Could not create account.");
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) return setErr("Wrong email or password.");
      window.location.assign("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="center">
      <div className="card" style={{ width: "100%", maxWidth: 380, textAlign: "left", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="logo" style={{ fontSize: 34 }}>Penny<i>.</i></div>
          <p className="sub" style={{ fontSize: 14, margin: "4px 0 0" }}>
            {mode === "in" ? "Welcome back" : "Create your free account"}
          </p>
        </div>

        <button className="s" style={{ width: "100%", display: "flex", gap: 10, justifyContent: "center", alignItems: "center", padding: 11 }}
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })} type="button">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
            <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="or">or</div>

        <form onSubmit={submit} className="field">
          {mode === "up" && (
            <input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input type="password" required minLength={8} maxLength={72} placeholder={mode === "up" ? "Password (8+ characters)" : "Password"}
            value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
          {err && <p className="err" role="alert">{err}</p>}
          <button className="p" type="submit" disabled={busy} style={{ padding: 11, opacity: busy ? 0.7 : 1 }}>
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="sub" style={{ textAlign: "center", margin: "16px 0 0", fontSize: 13 }}>
          {mode === "in" ? "New to Penny? " : "Already have an account? "}
          <button type="button" className="link" onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(""); }}>
            {mode === "in" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}