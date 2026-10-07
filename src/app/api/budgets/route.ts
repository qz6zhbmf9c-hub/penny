import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const budgets = await prisma.budget.findMany({ where: { userId: user!.id } });
  return NextResponse.json(budgets);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const { category, limitCents } = await req.json();
  
  const budget = await prisma.budget.upsert({
    where: { userId_category: { userId: user!.id, category } },
    update: { limitCents },
    create: { userId: user!.id, category, limitCents }
  });
  return NextResponse.json(budget);
}