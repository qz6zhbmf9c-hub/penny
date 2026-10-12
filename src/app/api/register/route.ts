import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { allow, codeMatches, open, tokenId } from "@/lib/otp";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = String(body?.pendingToken ?? "");
  const code = String(body?.code ?? "").replace(/\D/g, "");

  if (!token || code.length !== 6) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const pending = open(token);
  if (!pending) {
    return NextResponse.json({ error: "This code has expired. Request a new one." }, { status: 400 });
  }

  // Max 5 guesses per code
  if (!allow(`verify:${tokenId(token)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
  }

  if (!codeMatches(pending.e, code, pending.o)) {
    return NextResponse.json({ error: "That code is incorrect." }, { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        email: pending.e,
        name: pending.n,
        passwordHash: pending.p,
        emailVerified: new Date(),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists. Sign in instead." }, { status: 409 });
    }
    console.error("Register error:", e);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}