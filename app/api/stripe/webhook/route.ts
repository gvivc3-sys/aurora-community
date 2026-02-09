import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Use `any` for event data to avoid Stripe SDK type churn between versions.
  // The actual API payloads are stable — types just move around between SDK releases.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = event.data.object as any;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        if (obj.mode === "subscription" && obj.subscription) {
          const subId =
            typeof obj.subscription === "string"
              ? obj.subscription
              : obj.subscription.id;

          // Resolve userId from session or subscription metadata
          let userId = obj.metadata?.supabase_user_id;
          if (!userId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            userId = sub.metadata.supabase_user_id;
          }

          if (userId) {
            await supabaseAdmin.from("subscriptions").upsert(
              {
                user_id: userId,
                stripe_customer_id:
                  typeof obj.customer === "string"
                    ? obj.customer
                    : obj.customer.id,
                stripe_subscription_id: subId,
                status: "active",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            );
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const subId = getSubscriptionIdFromInvoice(obj);
        if (subId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const subId = getSubscriptionIdFromInvoice(obj);
        if (subId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const status = mapStripeStatus(obj.status);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", obj.id);

        if (status === "canceled" || status === "unpaid") {
          await kickFromTelegram(obj.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        await kickFromTelegram(obj.id);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", obj.id);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

// Extract subscription ID from invoice — handles both old (invoice.subscription)
// and new (invoice.parent.subscription_details.subscription) Stripe SDK shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubscriptionIdFromInvoice(invoice: any): string | null {
  // Old shape: invoice.subscription
  if (invoice.subscription) {
    return typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription.id;
  }
  // New shape: invoice.parent.subscription_details.subscription
  const sub = invoice.parent?.subscription_details?.subscription;
  if (sub) {
    return typeof sub === "string" ? sub : sub.id;
  }
  return null;
}

function mapStripeStatus(
  status: string,
): "active" | "past_due" | "canceled" | "unpaid" | "inactive" {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "unpaid";
    default:
      return "inactive";
  }
}

async function kickFromTelegram(stripeSubscriptionId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("telegram_user_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single();

  if (!sub?.telegram_user_id) return;

  try {
    await fetch(
      `https://api.telegram.org/bot${botToken}/banChatMember`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: parseInt(sub.telegram_user_id, 10),
          revoke_messages: false,
        }),
      },
    );
    // Immediately unban so they can rejoin if they re-subscribe
    await fetch(
      `https://api.telegram.org/bot${botToken}/unbanChatMember`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: parseInt(sub.telegram_user_id, 10),
          only_if_banned: true,
        }),
      },
    );
  } catch (err) {
    console.error("Telegram kick failed:", err);
  }
}
