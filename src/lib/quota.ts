import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FREE_AI_LIMIT, FREE_ROAST_LIMIT } from "@/lib/limits";

export type Kind = "ai" | "roast";

export async function reserve(userId: string, kind: Kind): Promise<number | null> {
  try {
    if (kind === "ai") {
      const u = await prisma.user.update({
        where: { id: userId, freeAiActionsUsed: { lt: FREE_AI_LIMIT } },
        data: { freeAiActionsUsed: { increment: 1 } },
        select: { freeAiActionsUsed: true },
      });
      return u.freeAiActionsUsed;
    }
    const u = await prisma.user.update({
      where: { id: userId, freeRoastsUsed: { lt: FREE_ROAST_LIMIT } },
      data: { freeRoastsUsed: { increment: 1 } },
      select: { freeRoastsUsed: true },
    });
    return u.freeRoastsUsed;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null; 
    throw e;
  }
}

export async function refund(userId: string, kind: Kind) {
  try {
    if (kind === "ai") {
      await prisma.user.updateMany({ where: { id: userId, freeAiActionsUsed: { gt: 0 } }, data: { freeAiActionsUsed: { decrement: 1 } } });
    } else {
      await prisma.user.updateMany({ where: { id: userId, freeRoastsUsed: { gt: 0 } }, data: { freeRoastsUsed: { decrement: 1 } } });
    }
  } catch (e) {
    console.error("refund failed:", e);
  }
}

export const aiLeft = (used: number) => Math.max(0, FREE_AI_LIMIT - used);
export const roastLeft = (used: number) => Math.max(0, FREE_ROAST_LIMIT - used);