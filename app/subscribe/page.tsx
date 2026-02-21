import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { createCheckoutSession } from "@/lib/actions/stripe";

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
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            Membership
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Join the <span className="font-medium">Aurora</span> Community
          </h1>
          <p className="mx-auto mt-4 max-w-md text-warm-600">
            Get full access to the feed, community chat, curated content, and
            connect with women on the same path.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-medium text-warm-900">Aurora Member</h2>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-light tracking-tight text-warm-900">
                $77
              </span>
              <span className="text-sm text-warm-500">/month</span>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "Weekly voice notes from Ashley",
              "Video guides, articles & curated content",
              "Private messaging with the Aurora team",
              "Community feed — like, comment & save",
              "New content added weekly",
              "Cancel anytime",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-warm-700">{feature}</span>
              </li>
            ))}
          </ul>

          <form action={createCheckoutSession} className="mt-8">
            <button
              type="submit"
              className="w-full rounded-full bg-warm-800 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
            >
              Subscribe Now
            </button>
          </form>

          {sub?.status === "canceled" && (
            <p className="mt-4 text-center text-xs text-warm-500">
              Your subscription was canceled. Subscribe again to regain access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
