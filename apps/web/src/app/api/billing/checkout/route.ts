import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const interval: "monthly" | "annual" = body.interval ?? "monthly";
    const tenantId: string = body.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId required" }, { status: 400 });
    }

    // Verify user is owner of this tenant
    const { data: member } = await supabase
      .from("tenant_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("tenant_id", tenantId)
      .single();

    if (!member || member.role !== "owner") {
      return NextResponse.json(
        { error: "Only tenant owners can manage billing" },
        { status: 403 },
      );
    }

    const priceId =
      interval === "annual"
        ? STRIPE_PRICES.paid_annual
        : STRIPE_PRICES.paid_monthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/settings/billing?success=true`,
      cancel_url: `${req.nextUrl.origin}/settings/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        tenantId,
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          tenantId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
