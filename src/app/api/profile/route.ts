import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/otp";

const validPw = (p: string) => p.length >= 8 && Buffer.byteLength(p) <= 72;

async function userId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user, google] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true, isPro: true, proSince: true, passwordHash: true },
    }),
    prisma.account.findFirst({ where: { userId: id, provider: "google" }, select: { id: true } }),
  ]);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    isPro: user.isPro,
    proSince: user.proSince,
    hasGoogle: !!google,
    hasPassword: user.passwordHash !== null,
  });
}

export async function PATCH(req: Request) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id }, select: { passwordHash: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: { name?: string | null; passwordHash?: string } = {};

  if (typeof body.name === "string") {
    data.name = body.name.trim().slice(0, 80) || null;
  }

  if (typeof body.newPassword === "string") {
    const next = body.newPassword;
    if (!validPw(next)) {
      return NextResponse.json({ error: "Password must be 8 to 72 characters." }, { status: 400 });
    }
    if (user.passwordHash) {
      const current = String(body.currentPassword ?? "");
      if (!current || !(await bcrypt.compare(current, user.passwordHash))) {
        return NextResponse.json({ error: "Your current password is incorrect." }, { status: 403 });
      }
    }
    data.passwordHash = await bcrypt.hash(next, 12);
  }

  if (!Object.keys(data).length) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = await prisma.user.update({ where: { id }, data, select: { name: true } });
  return NextResponse.json({ ok: true, name: updated.name });
}

export async function DELETE(req: Request) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const reason = String(body?.reason ?? "").trim().slice(0, 1000);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true, name: true, isPro: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const to = process.env.SMTP_EMAIL;
    if (to) {
      await sendMail({
        to,
        subject: `Penny account deleted: ${"★".repeat(rating)}${"☆".repeat(5 - rating)}`,
        text: [
          `User: ${user.email ?? "(no email)"}${user.name ? ` (${user.name})` : ""}`,
          `Plan: ${user.isPro ? "Pro" : "Free"}`,
          `Rating: ${rating}/5`,
          `Reason: ${reason || "(none given)"}`,
        ].join("\n"),
      });
    }
  } catch (e) {
    console.error("Feedback email failed:", e);
  }

  try {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { userId: id } }),
      prisma.budget.deleteMany({ where: { userId: id } }),
      prisma.goal.deleteMany({ where: { userId: id } }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.account.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Delete account error:", e);
    return NextResponse.json({ error: "Could not delete the account." }, { status: 500 });
  }
}