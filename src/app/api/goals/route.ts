import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const goals = await prisma.goal.findMany({ where: { userId: user!.id } });
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const { name, targetCents } = await req.json();
  
  const goal = await prisma.goal.create({
    data: { userId: user!.id, name, targetCents }
  });
  return NextResponse.json(goal);
}