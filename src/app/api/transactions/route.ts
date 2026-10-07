import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' }
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  
  const newTx = await prisma.transaction.create({
    data: {
      userId: user.id,
      date: new Date(body.date),
      type: body.type,
      category: body.category,
      note: body.note,
      amountCents: body.amountCents,
    }
  });

  return NextResponse.json(newTx);
}