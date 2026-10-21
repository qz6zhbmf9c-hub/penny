import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { addCents } = await req.json();
    const updated = await prisma.goal.updateMany({
      where: { id, userId: session.user.id },
      data: { savedCents: { increment: Math.round(Number(addCents) || 0) } },
    });
    if (updated.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const goal = await prisma.goal.findUnique({ where: { id } });
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.isPro) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const deleted = await prisma.goal.deleteMany({
      where: { id, userId: session.user.id },
    });
    if (deleted.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}