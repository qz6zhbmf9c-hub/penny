import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { authOptions } from "@/lib/auth";



export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }
  if (session.user.isPro) {
    return NextResponse.json({ error: "Already Pro" }, { status: 400 });
  }

  const { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_ID, NEXTAUTH_URL } =
    process.env;
  if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !LEMONSQUEEZY_VARIANT_ID) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  lemonSqueezySetup({ apiKey: LEMONSQUEEZY_API_KEY });

  const { data, error } = await createCheckout(LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_ID, {
    checkoutData: {
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      custom: { user_id: session.user.id },
    },
    productOptions: {
      redirectUrl: `${NEXTAUTH_URL}/dashboard?upgraded=1`,
    },
    // testMode: true, // uncomment if your store is in test mode and the checkout rejects live mode
  });

  if (error || !data) {
    console.error("Lemon Squeezy checkout error:", error);
    return NextResponse.json({ error: "Could not create checkout" }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.attributes.url });
}