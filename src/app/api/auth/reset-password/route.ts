import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { allow, codeMatches, fingerprint, open, tokenId } from "@/lib/otp";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = String(body?.pendingToken ?? "");
  const code = String(body?.code ?? "").replace(/\D/g, "");
  const password = String(body?.password ?? "");

  if (!token || code.length !== 6) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }
  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    return NextResponse.json({ error: "Password must be 8 to 72 characters." }, { status: 400 });
  }

  const pending = open(token, "reset");
  if (!pending) {
    return NextResponse.json({ error: "This code has expired. Request a new one." }, { status: 400 });
  }

  if (!allow(`resetverify:${tokenId(token)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
  }
  if (!codeMatches(pending.e, code, pending.o, "reset")) {
    return NextResponse.json({ error: "That code is incorrect." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: pending.e },
      select: { id: true, passwordHash: true, emailVerified: true },
    });
    if (!user) {
      return NextResponse.json({ error: "This code is invalid or has expired." }, { status: 400 });
    }
    if (fingerprint(user.passwordHash ?? "none") !== pending.p) {
      return NextResponse.json({ error: "This code was already used. Request a new one." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(password, 12),
        emailVerified: user.emailVerified ?? new Date(),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password error:", e);
    return NextResponse.json({ error: "Could not reset the password." }, { status: 500 });
  }
}