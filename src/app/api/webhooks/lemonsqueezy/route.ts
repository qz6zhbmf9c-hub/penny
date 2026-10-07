import crypto from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";



function validSignature(raw: string, signature: string, secret: string) {
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // Must read the raw text: parsing JSON first would break the signature check
  const raw = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  if (!validSignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
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

  // Only accept orders for your own store and product
  const storeOk = String(attrs.store_id) === process.env.LEMONSQUEEZY_STORE_ID;
  const variantOk =
    String(attrs.first_order_item?.variant_id) === process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!storeOk || !variantOk) return NextResponse.json({ ok: true });

  const eventKey = `${event}:${order.id}`;

  try {
    if (event === "order_created" && attrs.status === "paid") {
      const userId: string | undefined = body.meta?.custom_data?.user_id;
      if (!userId) return NextResponse.json({ ok: true });

      await prisma.$transaction([
        prisma.webhookEvent.create({ data: { id: eventKey } }), // throws P2002 if already handled
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
      return NextResponse.json({ ok: true, duplicate: true }); // already processed
    }
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 }); // LS will retry
  }

  return NextResponse.json({ ok: true });
}