import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { getActiveNotice } from "@/lib/actions/notices";
import AdminInbox from "@/app/inbox/admin-inbox";
import NoticeForm from "./notice-form";
import RealtimeRefresh from "@/components/realtime-refresh";
import BackLink from "@/components/back-link";

export const dynamic = "force-dynamic";

type Tab = "notice" | "whispers";

export default async function ManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user)) redirect("/dashboard");

  const params = await searchParams;
  const tab: Tab = params.tab === "whispers" ? "whispers" : "notice";

  const [activeNotice, messages] = await Promise.all([
    getActiveNotice(),
    supabaseAdmin
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then((r) => r.data ?? []),
  ]);

  const unread = messages.filter((m: { read: boolean }) => !m.read).length;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      {tab === "whispers" && <RealtimeRefresh table="messages" />}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <BackLink />

        <h1 className="mt-4 text-2xl font-light tracking-tight text-warm-900">
          Management
        </h1>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl border border-warm-200 bg-white p-1 shadow-sm">
          <a
            href="/management?tab=notice"
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              tab === "notice"
                ? "bg-warm-900 text-white shadow-sm"
                : "text-warm-600 hover:text-warm-900"
            }`}
          >
            Notice
          </a>
          <a
            href="/management?tab=whispers"
            className={`relative flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              tab === "whispers"
                ? "bg-warm-900 text-white shadow-sm"
                : "text-warm-600 hover:text-warm-900"
            }`}
          >
            Whispers
            {unread > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </a>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {tab === "notice" && (
            <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
              <NoticeForm active={activeNotice as unknown as { id: string; body: string; bg: "default" | "amber" | "rose" | "fuchsia" | "green" } | null} />
            </div>
          )}

          {tab === "whispers" && (
            <AdminInbox messages={messages} />
          )}
        </div>
      </div>
    </div>
  );
}
