import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allow, codeHash, expiry, fingerprint, makeCode, seal, sendResetEmail } from "@/lib/otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!allow(`reset:${email}`, 1, 60_000)) {
    return NextResponse.json({ error: "Please wait a minute before requesting another code." }, { status: 429 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true },
    });

    const code = makeCode();
    const pendingToken = seal(
      {
        e: email,
        n: null,
        p: fingerprint(user ? (user.passwordHash ?? "none") : "no-user"),
        o: codeHash(email, code, "reset"),
        x: expiry(),
      },
      "reset"
    );

    if (user) await sendResetEmail(email, code);

    return NextResponse.json({ pendingToken });
  } catch (e) {
    console.error("forgot-password error:", e);
    return NextResponse.json({ error: "Couldn't send the email. Please try again." }, { status: 500 });
  }
}