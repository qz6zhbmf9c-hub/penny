"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [busy, setBusy] = useState(false);

  async function upgrade() {
    setBusy(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else {
      alert(json.error ?? "Something went wrong");
      setBusy(false);
    }
  }

  if (status === "loading") return null;
  if (!session) return <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Sign in with Google</button>;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>{session.user.email}</span>
      {session.user.isPro ? <b>✨ Pro</b> : <button onClick={upgrade} disabled={busy}>{busy ? "Loading…" : "Upgrade to Pro"}</button>}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}