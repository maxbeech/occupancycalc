import { NextResponse } from "next/server";

// Env-gated Stripe checkout. Without STRIPE_SECRET_KEY + STRIPE_PRICE_ID the
// route returns 503 and the UI shows an early-access notice (graceful degrade).
export async function POST() {
  const key = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  if (!key || !price) {
    return NextResponse.json({ error: "Pro checkout not configured yet." }, { status: 503 });
  }
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://occupancycalc.com";
    const body = new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/pricing?status=success`,
      cancel_url: `${origin}/pricing?status=cancel`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return NextResponse.json({ error: "Checkout error" }, { status: 502 });
    const session = await res.json();
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Checkout error" }, { status: 502 });
  }
}
