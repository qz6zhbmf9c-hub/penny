// @ts-nocheck
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // .trim() removes any accidental invisible spaces you might have pasted into Vercel
  const secret = (process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "").trim();
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // Read the exact raw bytes over the network so Next.js doesn't alter the formatting
  const buffer = Buffer.from(await req.arrayBuffer());
  const raw = buffer.toString("utf-8");
  
  const signature = req.headers.get("x-signature") ?? "";

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(raw).digest("hex"), "utf8");
    const sig = Buffer.from(signature, "utf8");

    if (digest.length !== sig.length || !crypto.timingSafeEqual(digest, sig)) {
      console.error("Signature mismatch. Secret or body is malformed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid signature logic" }, { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const event: string | undefined = body?.meta?.event_name;
  const order = body?.data;
  const attrs = order?.attributes;
  if (!event || !order?.id || !attrs) return NextResponse.json({ ok: true });

  const envStoreId = String(process.env.LEMONSQUEEZY_STORE_ID || "").trim();
  const envVariantId = String(process.env.LEMONSQUEEZY_VARIANT_ID || "").trim();
  
  const storeOk = String(attrs.store_id) === envStoreId;
  const variantOk = String(attrs.first_order_item?.variant_id) === envVariantId;
  if (!storeOk || !variantOk) return NextResponse.json({ ok: true });

  const eventKey = `${event}:${order.id}`;

  try {
    if (event === "order_created" && attrs.status === "paid") {
      const userId: string | undefined = body.meta?.custom_data?.user_id;
      if (!userId) return NextResponse.json({ ok: true });

      await prisma.$transaction([
        prisma.webhookEvent.create({ data: { id: eventKey } }), 
        prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            proSince: new Date(),
            lsOrderId: String(order.id),
            lsCustomerId: String(attrs.customer_id),
          },
        }),
      ]);
    } else if (event === "order_refunded") {
      await prisma.$transaction([
        prisma.webhookEvent.create({ data: { id: eventKey } }),
        prisma.user.updateMany({
          where: { lsOrderId: String(order.id) },
          data: { isPro: false },
        }),
      ]);
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ ok: true, duplicate: true }); 
    }
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }

  return NextResponse.json({ ok: true });
}