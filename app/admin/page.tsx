import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { stripe } from "@/lib/stripe";
import MonthlyCustomersChart from "@/components/monthly-customers-chart";
import GrowthRangeSelect from "@/components/growth-range-select";
import AdminBadge from "@/components/admin-badge";

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

async function countSince(
  table: "posts" | "comments" | "friend_flags" | "threads" | "thread_replies",
  since: string,
) {
  const { count } = await supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte("created_at", since);
  return count ?? 0;
}

async function fetchSectionActivity() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [posts, comments, friendFlags, threads, threadReplies] = await Promise.all([
    countSince("posts", since),
    countSince("comments", since),
    countSince("friend_flags", since),
    countSince("threads", since),
    countSince("thread_replies", since),
  ]);

  const sections = [
    { label: "Portal", value: posts + comments },
    { label: "Gather", value: friendFlags },
    { label: "Discussions", value: threads + threadReplies },
  ];

  const total = sections.reduce((sum, s) => sum + s.value, 0);
  return sections.map((s) => ({ ...s, percent: total > 0 ? Math.round((s.value / total) * 100) : 0 }));
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const rawRange = params.range;
  const range =
    rawRange === "60d" || rawRange === "120d" || rawRange === "year" ? rawRange : "30d";
  const rangeLabel =
    range === "60d"
      ? "Last 60 Days"
      : range === "120d"
        ? "Last 120 Days"
        : range === "year"
          ? "This Year"
          : "Last 30 Days";

  // Fetch everything in parallel
  const [usersRes, allSubs, allTxns, sectionActivity] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    fetchAllSubscriptions(),
    fetchAllBalanceTransactions(),
    fetchSectionActivity(),
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

  // New paying customers over the selected range, based on currently
  // active/trialing subscriptions only. "year" buckets by month; the
  // day ranges bucket by day, with sparse labels so charts don't get
  // cluttered with 60-120 overlapping labels.
  function withSparseLabels<T extends { label: string }>(
    buckets: T[],
    maxLabels: number,
  ): (T & { showLabel: boolean })[] {
    if (buckets.length <= maxLabels) {
      return buckets.map((b) => ({ ...b, showLabel: true }));
    }
    const step = (buckets.length - 1) / (maxLabels - 1);
    const shown = new Set(
      Array.from({ length: maxLabels }, (_, i) => Math.round(i * step)),
    );
    return buckets.map((b, i) => ({ ...b, showLabel: shown.has(i) }));
  }

  const growthData = (() => {
    if (range === "year") {
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
      return buckets.map((b) => ({ ...b, showLabel: true }));
    }

    const days = range === "60d" ? 60 : range === "120d" ? 120 : 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullLabel: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        count: 0,
      };
    });
    const indexByKey = new Map(buckets.map((b, i) => [b.key, i]));
    for (const sub of activeSubs) {
      const d = new Date(sub.start_date * 1000);
      const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      if (idx !== undefined) buckets[idx].count += 1;
    }
    return withSparseLabels(buckets, 7);
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
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-4xl px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <AdminBadge />
        <h1 className="mt-2 text-2xl font-light tracking-tight text-warm-900">
          Community Stats
        </h1>

        <div className="mt-6 space-y-4">
          {/* Growth */}
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-none sm:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-medium text-warm-500">
                New Paying Customers <span className="text-warm-400">({rangeLabel})</span>
              </h2>
              <GrowthRangeSelect current={range} />
            </div>
            <div className="mt-4">
              <MonthlyCustomersChart data={growthData} />
            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-none sm:shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Revenue</h2>
            <div className="mt-4 grid grid-cols-3 divide-x divide-warm-100">
              {revenueStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-light tracking-tight text-warm-900 sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-warm-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribers */}
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-none sm:shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Subscribers</h2>
            <div className="mt-4 grid grid-cols-4 divide-x divide-warm-100">
              {subscriberStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-light tracking-tight text-warm-900 sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-warm-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Health */}
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-none sm:shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Health</h2>
            <div className="mt-4 grid grid-cols-2 divide-x divide-warm-100">
              {healthStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-light tracking-tight text-warm-900 sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-warm-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-none sm:shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">
              Activity by Section <span className="text-warm-400">(Last 30 Days)</span>
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {sectionActivity.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-light tracking-tight text-warm-900 sm:text-2xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-warm-500">{s.label}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-warm-100">
                    <div
                      className="h-full rounded-full bg-warm-600"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-warm-400">{s.percent}%</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-warm-400">
              Posts, comments, replies, and Gather flags created in the last 30 days. This measures
              content activity, not page views -- there&apos;s no visit-tracking analytics installed yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
