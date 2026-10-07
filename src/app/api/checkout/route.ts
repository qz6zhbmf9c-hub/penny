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

  const { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_ID } =
    process.env;
  if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !LEMONSQUEEZY_VARIANT_ID) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  lemonSqueezySetup({ apiKey: LEMONSQUEEZY_API_KEY });

  // Fallback directly to your live production domain just in case NEXTAUTH_URL is missing
  const baseUrl = process.env.NEXTAUTH_URL || "https://penny-nine-gamma.vercel.app";

  const { data, error } = await createCheckout(LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_ID, {
    checkoutData: {
      email: session.user.email ?? undefined,
      name: session.user.name ?? undefined,
      custom: { user_id: session.user.id },
    },
    productOptions: {
      redirectUrl: `${baseUrl}/dashboard?upgraded=1`,
    },
    testMode: true, // <-- FIX: Explicitly tell Lemon Squeezy this is a test checkout
  });

  if (error || !data) {
    console.error("Lemon Squeezy checkout error:", error);
    return NextResponse.json({ error: "Could not create checkout" }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.attributes.url });
}