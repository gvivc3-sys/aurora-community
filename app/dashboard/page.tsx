import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-zinc-500">
          Welcome back, {user.email}
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Account details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-zinc-900">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">User ID</dt>
              <dd className="font-mono text-zinc-900">{user.id.slice(0, 8)}...</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Joined</dt>
              <dd className="text-zinc-900">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
