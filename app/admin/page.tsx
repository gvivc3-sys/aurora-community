import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  // Fetch stats in parallel
  const [usersRes, subscribersRes] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .in("status", ["active", "past_due"])
      .not("stripe_subscription_id", "is", null),
  ]);

  const totalMembers = usersRes.data?.users?.length ?? 0;
  const activeSubscribers = subscribersRes.count ?? 0;
  const adminCount =
    usersRes.data?.users?.filter(
      (u) => u.app_metadata?.role === "admin",
    ).length ?? 0;

  const stats = [
    { label: "Total Members", value: totalMembers },
    { label: "Paid Subscribers", value: activeSubscribers },
    { label: "Admins", value: adminCount },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            Admin
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Community Stats
          </h1>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-warm-200 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-4xl font-light tracking-tight text-warm-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-warm-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
