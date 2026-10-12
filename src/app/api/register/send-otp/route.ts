import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { allow, codeHash, expiry, makeCode, seal, sendOtpEmail } from "@/lib/otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const name = String(body?.name ?? "").trim().slice(0, 80) || null;

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    return NextResponse.json({ error: "Password must be 8 to 72 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      {
        error: existing.passwordHash
          ? "An account with this email already exists. Sign in instead."
          : "This email is registered with Google. Use “Continue with Google”.",
      },
      { status: 409 }
    );
  }

  // One code per email per minute (stops mail bombing and Gmail quota burn)
  if (!allow(`send:${email}`, 1, 60_000)) {
    return NextResponse.json({ error: "Please wait a minute before requesting another code." }, { status: 429 });
  }

  try {
    const code = makeCode();
    const pendingToken = seal({
      e: email,
      n: name,
      p: await bcrypt.hash(password, 12),
      o: codeHash(email, code),
      x: expiry(),
    });
    await sendOtpEmail(email, code);
    return NextResponse.json({ pendingToken });
  } catch (e) {
    console.error("send-otp error:", e);
    return NextResponse.json({ error: "Couldn't send the email. Please try again." }, { status: 500 });
  }
}