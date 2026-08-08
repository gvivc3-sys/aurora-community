import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { stripe } from "@/lib/stripe";
import Avatar from "@/components/avatar";
import AdminBadge from "@/components/admin-badge";

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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminProfilesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeOnly = params.status === "active";
  const payingOnly = params.payments === "gt0";
  const sortOrder = params.sort === "oldest" ? "oldest" : "newest";
  const query = (typeof params.q === "string" ? params.q : "").trim();

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

  // Sort by signup date
  const sorted = [...users].sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
  });

  const q = query.toLowerCase();
  const rows = sorted
    .map((u) => {
      const sub = subByUserId.get(u.id);
      const status = sub?.status ?? "none";
      const payments = sub?.stripe_customer_id
        ? (chargeCountByCustomer.get(sub.stripe_customer_id) ?? 0)
        : 0;
      return { u, sub, status, payments };
    })
    .filter((row) => (activeOnly ? row.status === "active" : true))
    .filter((row) => (payingOnly ? row.payments > 0 : true))
    .filter((row) => {
      if (!q) return true;
      const username = row.u.user_metadata?.username ?? row.u.user_metadata?.name ?? "";
      const handle = row.u.user_metadata?.handle ?? "";
      const email = row.u.email ?? "";
      return (
        username.toLowerCase().includes(q) ||
        handle.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q)
      );
    });

  function toHref(overrides: Record<string, string | undefined>) {
    const current: Record<string, string | undefined> = {
      status: activeOnly ? "active" : undefined,
      payments: payingOnly ? "gt0" : undefined,
      sort: sortOrder === "oldest" ? "oldest" : undefined,
      q: query || undefined,
    };
    const merged = { ...current, ...overrides };
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) qs.set(key, value);
    }
    const s = qs.toString();
    return s ? `/admin/profiles?${s}` : "/admin/profiles";
  }

  const activeHref = toHref({ status: activeOnly ? undefined : "active" });
  const payingHref = toHref({ payments: payingOnly ? undefined : "gt0" });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-3xl px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <AdminBadge />
        <h1 className="mt-2 text-2xl font-light tracking-tight text-warm-900">
          Profiles
        </h1>
        <p className="mt-1 text-sm text-warm-500">
          {rows.length} of {users.length} {users.length === 1 ? "member" : "members"}
        </p>

        <form action="/admin/profiles" method="get" className="mt-4">
          {activeOnly && <input type="hidden" name="status" value="active" />}
          {payingOnly && <input type="hidden" name="payments" value="gt0" />}
          {sortOrder === "oldest" && <input type="hidden" name="sort" value="oldest" />}
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, handle, or email"
            className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-400 focus:outline-none"
          />
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={activeHref}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeOnly ? "bg-warm-800 text-white" : "border border-warm-200 text-warm-600 hover:bg-warm-100"
            }`}
          >
            Active
          </Link>
          <Link
            href={payingHref}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              payingOnly ? "bg-warm-800 text-white" : "border border-warm-200 text-warm-600 hover:bg-warm-100"
            }`}
          >
            Payments &gt; 0
          </Link>

          <div className="ml-auto flex items-center gap-1 rounded-full border border-warm-200 p-0.5">
            <Link
              href={toHref({ sort: undefined })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortOrder === "newest" ? "bg-warm-800 text-white" : "text-warm-600 hover:bg-warm-100"
              }`}
            >
              Newest
            </Link>
            <Link
              href={toHref({ sort: "oldest" })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortOrder === "oldest" ? "bg-warm-800 text-white" : "text-warm-600 hover:bg-warm-100"
              }`}
            >
              Oldest
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
          {rows.map(({ u, status, payments }) => {
            const username =
              u.user_metadata?.username ?? u.user_metadata?.name ?? null;
            const avatarUrl = u.user_metadata?.custom_avatar_url ?? u.user_metadata?.avatar_url ?? null;

            return (
              <div
                key={u.id}
                className="flex items-center gap-3 border-b border-warm-100 px-3 py-2.5 last:border-b-0 sm:px-4 sm:py-3"
              >
                <Link href={`/profile/${u.id}`} className="shrink-0">
                  <Avatar
                    src={avatarUrl}
                    name={username}
                    email={u.email}
                    size="sm"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
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
                  <p className="mt-0.5 truncate text-xs text-warm-400">
                    {username && u.email ? `${u.email} · ` : ""}
                    Signed up {formatDate(u.created_at)} · Active {formatRelative(u.last_sign_in_at)}
                  </p>
                  <p className="mt-0.5 text-xs text-warm-400">
                    {payments} payment{payments === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
