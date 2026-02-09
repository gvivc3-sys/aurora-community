"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Check for existing Stripe customer
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = existingSub?.stripe_customer_id;

  if (!customerId) {
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    // Upsert subscription row
    await supabaseAdmin.from("subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: "inactive",
    });
  }

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?subscribed=true`,
    cancel_url: `${siteUrl}/subscribe`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  redirect(session.url!);
}

export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_customer_id) {
    redirect("/subscribe");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${siteUrl}/dashboard`,
  });

  redirect(session.url);
}
