import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { stripe } from "@/lib/stripe";
import Avatar from "@/components/avatar";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  past_due: "bg-amber-100 text-amber-800",
  canceled: "bg-red-100 text-red-700",
  unpaid: "bg-red-100 text-red-700",
  inactive: "bg-warm-100 text-warm-500",
};

async function fetchAllCharges() {
  const charges: Awaited<ReturnType<typeof stripe.charges.list>>["data"] = [];
  for await (const charge of stripe.charges.list({ limit: 100 })) {
    charges.push(charge);
  }
  return charges;
}

export default async function AdminProfilesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  const [usersRes, subsRes, allCharges] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin.from("subscriptions").select("*"),
    fetchAllCharges(),
  ]);

  const users = usersRes.data?.users ?? [];
  const subscriptions = subsRes.data ?? [];

  // Build lookup maps
  const subByUserId = new Map(subscriptions.map((s) => [s.user_id, s]));

  const successfulCharges = allCharges.filter((c) => c.status === "succeeded");
  const chargeCountByCustomer = new Map<string, number>();
  for (const charge of successfulCharges) {
    const cid = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
    if (cid) {
      chargeCountByCustomer.set(cid, (chargeCountByCustomer.get(cid) ?? 0) + 1);
    }
  }

  // Sort by last active (most recent first), nulls last
  const sorted = [...users].sort((a, b) => {
    const aTime = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
    const bTime = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            Admin
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Profiles
          </h1>
          <p className="mt-2 text-sm text-warm-500">
            {users.length} {users.length === 1 ? "member" : "members"}
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {sorted.map((u) => {
            const sub = subByUserId.get(u.id);
            const status = sub?.status ?? "none";
            const payments = sub?.stripe_customer_id
              ? (chargeCountByCustomer.get(sub.stripe_customer_id) ?? 0)
              : 0;
            const username =
              u.user_metadata?.username ?? u.user_metadata?.name ?? null;
            const avatarUrl = u.user_metadata?.avatar_url ?? null;

            return (
              <div
                key={u.id}
                className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${u.id}`} className="shrink-0">
                    <Avatar
                      src={avatarUrl}
                      name={username}
                      email={u.email}
                      size="sm"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/profile/${u.id}`}
                        className="truncate text-sm font-medium text-warm-900 hover:underline"
                      >
                        {username || u.email || "Unknown"}
                      </Link>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColors[status] ?? "bg-warm-100 text-warm-500"}`}
                      >
                        {status === "none" ? "no sub" : status.replace("_", " ")}
                      </span>
                    </div>
                    {username && u.email && (
                      <p className="mt-0.5 truncate text-xs text-warm-400">
                        {u.email}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-warm-500">
                      <span>
                        Signed up{" "}
                        <span className="text-warm-700">
                          {formatDate(u.created_at)}
                        </span>
                      </span>
                      <span>
                        Last active{" "}
                        <span className="text-warm-700">
                          {formatRelative(u.last_sign_in_at)}
                        </span>
                      </span>
                      <span>
                        Payments{" "}
                        <span className="text-warm-700">{payments}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
