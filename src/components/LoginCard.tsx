"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const URL_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "That email is already registered with a password. Sign in with your email below.",
  default: "Sign-in failed. Please try again.",
};

type Mode = "in" | "up" | "forgot";

async function post(url: string, data: unknown) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j };
}

export default function LoginCard() {
  const [mode, setMode] = useState<Mode>("in");
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPw, setNewPw] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const isReset = mode === "forgot";

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(URL_ERRORS[e] ?? URL_ERRORS.default);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function goto(m: Mode) {
    setMode(m); setStep("form"); setErr(""); setInfo("");
    setPending(""); setCode(""); setNewPw("");
  }

  async function requestCode(resend = false) {
    setErr(""); setInfo(""); setBusy(true);
    try {
      const { ok, j } = isReset
        ? await post("/api/auth/forgot-password", { email })
        : await post("/api/register/send-otp", { name, email, password });
      if (!ok) return setErr(j.error ?? "Couldn't send the code.");
      setPending(j.pendingToken);
      setCode("");
      setStep("code");
      setCooldown(60);
      if (resend) setInfo("New code sent.");
    } finally {
      setBusy(false);
    }
  }

  async function submitForm(ev: React.FormEvent) {
    ev.preventDefault();
    if (mode !== "in") return requestCode();
    setErr(""); setBusy(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) return setErr("Wrong email or password.");
      window.location.assign("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  async function verify(ev: React.FormEvent) {
    ev.preventDefault();
    if (code.length !== 6) return setErr("Enter the 6-digit code.");
    if (isReset && (newPw.length < 8 || newPw.length > 72)) return setErr("Password must be 8 to 72 characters.");
    setErr(""); setInfo(""); setBusy(true);
    try {
      const { ok, j } = isReset
        ? await post("/api/auth/reset-password", { pendingToken: pending, code, password: newPw })
        : await post("/api/register", { pendingToken: pending, code });
      if (!ok) return setErr(j.error ?? "Could not verify the code.");
      const res = await signIn("credentials", { email, password: isReset ? newPw : password, redirect: false });
      if (res?.error) return setErr(isReset ? "Password updated. Please sign in." : "Account created. Please sign in.");
      window.location.assign("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  const subtitle =
    step === "code"
      ? isReset ? "Reset your password" : "Verify your email"
      : mode === "in" ? "Welcome back" : mode === "up" ? "Create your free account" : "Forgot your password?";

  const codeReady = code.length === 6 && (!isReset || newPw.length >= 8);

  return (
    <div className="center">
      <div className="card" style={{ width: "100%", maxWidth: 380, textAlign: "left", padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div className="logo" style={{ fontSize: 34 }}>Penny<i>.</i></div>
          <p className="sub" style={{ fontSize: 14, margin: "4px 0 0" }}>{subtitle}</p>
        </div>

        {step === "code" ? (
          <form onSubmit={verify} className="field">
            <p className="sub" style={{ fontSize: 14, margin: 0, textAlign: "center" }}>
              Enter the 6-digit code sent to <b style={{ color: "var(--tx)" }}>{email}</b>
            </p>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="······"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{ textAlign: "center", fontSize: 28, fontWeight: 700, letterSpacing: "0.5em", paddingLeft: "0.5em" }}
            />
            {isReset && (
              <input
                type="password"
                required
                minLength={8}
                maxLength={72}
                placeholder="New password (8+ characters)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
              />
            )}
            {err && <p className="err" role="alert">{err}</p>}
            {info && <p className="sub" style={{ color: "var(--ok)", margin: 0 }}>{info}</p>}
            <button className="p" type="submit" disabled={busy || !codeReady} style={{ padding: 11, opacity: busy || !codeReady ? 0.7 : 1 }}>
              {busy ? "Please wait…" : isReset ? "Reset password & sign in" : "Verify & create account"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <button type="button" className="link" onClick={() => goto(mode)}>Change email</button>
              <button
                type="button"
                className="link"
                disabled={cooldown > 0 || busy}
                onClick={() => requestCode(true)}
                style={{ opacity: cooldown > 0 ? 0.5 : 1, cursor: cooldown > 0 ? "default" : "pointer" }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>
            <p className="sub" style={{ margin: 0, textAlign: "center", fontSize: 12 }}>
              Can&apos;t find it? Check your spam folder. The code expires in 10 minutes.
            </p>
          </form>
        ) : (
          <>
            {!isReset && (
              <>
                <button
                  className="s"
                  style={{ width: "100%", display: "flex", gap: 10, justifyContent: "center", alignItems: "center", padding: 11 }}
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                  </svg>
                  Continue with Google
                </button>
                <div className="or">or</div>
              </>
            )}

            <form onSubmit={submitForm} className="field">
              {isReset && (
                <p className="sub" style={{ fontSize: 14, margin: 0 }}>
                  Enter your email and we&apos;ll send you a 6-digit code to reset your password.
                </p>
              )}
              {mode === "up" && (
                <input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              )}
              <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              {!isReset && (
                <input
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  placeholder={mode === "up" ? "Password (8+ characters)" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
              )}
              {mode === "in" && (
                <div style={{ textAlign: "right", marginTop: -4 }}>
                  <button type="button" className="link" style={{ fontSize: 13 }} onClick={() => goto("forgot")}>
                    Forgot password?
                  </button>
                </div>
              )}
              {err && <p className="err" role="alert">{err}</p>}
              <button className="p" type="submit" disabled={busy} style={{ padding: 11, opacity: busy ? 0.7 : 1 }}>
                {busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Send verification code" : "Send reset code"}
              </button>
            </form>

            <p className="sub" style={{ textAlign: "center", margin: "16px 0 0", fontSize: 13 }}>
              {isReset ? (
                <button type="button" className="link" onClick={() => goto("in")}>Back to sign in</button>
              ) : (
                <>
                  {mode === "in" ? "New to Penny? " : "Already have an account? "}
                  <button type="button" className="link" onClick={() => goto(mode === "in" ? "up" : "in")}>
                    {mode === "in" ? "Create an account" : "Sign in"}
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}