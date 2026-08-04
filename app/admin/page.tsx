import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { stripe } from "@/lib/stripe";
import MonthlyCustomersChart from "@/components/monthly-customers-chart";

const PRICE_PER_MONTH = 77;

function currency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function months(value: number): string {
  return `${value.toFixed(1)} months`;
}

async function fetchAllSubscriptions() {
  const subs: Awaited<ReturnType<typeof stripe.subscriptions.list>>["data"] = [];
  for await (const sub of stripe.subscriptions.list({ status: "all", limit: 100 })) {
    subs.push(sub);
  }
  return subs;
}

async function fetchAllBalanceTransactions() {
  const txns: Awaited<ReturnType<typeof stripe.balanceTransactions.list>>["data"] = [];
  for await (const txn of stripe.balanceTransactions.list({ limit: 100, type: "charge" })) {
    txns.push(txn);
  }
  return txns;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  // Fetch everything in parallel
  const [usersRes, allSubs, allTxns] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    fetchAllSubscriptions(),
    fetchAllBalanceTransactions(),
  ]);

  const totalMembers = usersRes.data?.users?.length ?? 0;

  // Subscriber counts
  const activeSubs = allSubs.filter(
    (s) => s.status === "active" || s.status === "trialing",
  );
  const pastDueSubs = allSubs.filter((s) => s.status === "past_due");
  const canceledSubs = allSubs.filter((s) => s.status === "canceled");

  // Churn: canceled in last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const canceledLast30d = canceledSubs.filter(
    (s) => s.canceled_at && s.canceled_at * 1000 > thirtyDaysAgo,
  ).length;
  const churnDenominator = activeSubs.length + canceledLast30d;
  const monthlyChurnRate =
    churnDenominator > 0 ? canceledLast30d / churnDenominator : 0;

  // Revenue
  const mrr = activeSubs.length * PRICE_PER_MONTH;
  const projectedAnnual = mrr * 12;
  const churnAdjustedAnnual = projectedAnnual * (1 - monthlyChurnRate);

  const netRevenue =
    allTxns.reduce((sum, t) => sum + t.net, 0) / 100;

  // Average subscription age (active subs)
  const now = Date.now() / 1000;
  const avgSubAge =
    activeSubs.length > 0
      ? activeSubs.reduce((sum, s) => sum + (now - s.start_date), 0) /
        activeSubs.length /
        (30 * 24 * 60 * 60) // convert seconds to months
      : 0;

  // LTV
  const estimatedLtv =
    monthlyChurnRate > 0 ? PRICE_PER_MONTH / monthlyChurnRate : 0;

  // New paying customers per month (last 12 months), based on currently
  // active/trialing subscriptions only.
  const monthlyCustomers = (() => {
    const today = new Date();
    const buckets = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        fullLabel: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        count: 0,
      };
    });
    const indexByKey = new Map(buckets.map((b, i) => [b.key, i]));
    for (const sub of activeSubs) {
      const d = new Date(sub.start_date * 1000);
      const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (idx !== undefined) buckets[idx].count += 1;
    }
    return buckets;
  })();

  const revenueStats = [
    { label: "MRR", value: currency(mrr) },
    { label: "Churn-Adjusted Annual", value: currency(Math.round(churnAdjustedAnnual)) },
    { label: "Net Revenue", value: currency(Math.round(netRevenue)) },
  ];

  const subscriberStats = [
    { label: "Active", value: activeSubs.length },
    { label: "Past Due", value: pastDueSubs.length },
    { label: "Canceled", value: canceledSubs.length },
    { label: "Total Members", value: totalMembers },
  ];

  const healthStats = [
    { label: "Monthly Churn Rate", value: pct(monthlyChurnRate) },
    { label: "Avg Subscription Age", value: months(avgSubAge) },
    {
      label: "Estimated LTV",
      value: estimatedLtv > 0 ? currency(Math.round(estimatedLtv)) : "N/A",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-4xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-light tracking-tight text-warm-900">
          Community Stats
        </h1>

        {/* Growth */}
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-500">
            New Paying Customers by Month
          </p>
          <div className="mt-4">
            <MonthlyCustomersChart data={monthlyCustomers} />
          </div>
        </div>

        {/* Revenue */}
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-500">
            Revenue
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {revenueStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-warm-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-light tracking-tight text-warm-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-warm-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribers */}
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-500">
            Subscribers
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {subscriberStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-warm-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-light tracking-tight text-warm-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-warm-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Health */}
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm-500">
            Health
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {healthStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-warm-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-light tracking-tight text-warm-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-warm-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
