import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { createCheckoutSession } from "@/lib/actions/stripe";
import { CheckBadgeAlternateIcon } from "@/components/icons";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Admins skip paywall
  if (isAdmin(user)) {
    redirect("/dashboard");
  }

  // Already subscribed?
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single();

  if (sub?.status === "active" || sub?.status === "past_due") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-2xl px-3 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            Membership
          </p>
          <h1 className="mt-4 font-display text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Join <span className="font-medium">Aurora</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-warm-600">
            Get full access to the feed, community chat, curated content, and
            connect with women on the same path.
          </p>
        </div>

        {/* Pricing card */}
        <div className="relative mx-auto mt-12 max-w-sm">
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-teal-300/40 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative rounded-[20px] bg-teal-300 p-[3px] shadow-xl">
            <div className="rounded-[17px] bg-white px-8 py-10">
              <div className="text-center">
                <h2 className="font-display text-2xl font-medium tracking-tight text-warm-900">
                  Aurora
                </h2>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-sm text-warm-400 line-through">$55/month</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <CheckBadgeAlternateIcon className="h-3.5 w-3.5" />
                    Early Pricing
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-light tracking-tight text-warm-900">$38</span>
                  <span className="text-sm text-warm-500">/month</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {[
                  "Weekly voice notes from Ashley",
                  "Video guides, articles & curated content",
                  "Private messaging with the Aurora team",
                  "Community feed: like, comment & save",
                  "New content added weekly",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-warm-700">
                    <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-warm-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <form action={createCheckoutSession} className="mt-8">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-700 px-4 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]"
                >
                  Subscribe Now
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-warm-400">
                Cancel anytime. No contracts. No questions asked.
              </p>

              {sub?.status === "canceled" && (
                <p className="mt-4 text-center text-xs text-warm-500">
                  Your subscription was canceled. Subscribe again to regain access.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
