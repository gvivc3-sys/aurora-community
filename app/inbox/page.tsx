import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import AdminInbox from "./admin-inbox";
import UserInbox from "./user-inbox";
import RealtimeRefresh from "@/components/realtime-refresh";

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = isAdmin(user);

  if (admin) {
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
        <RealtimeRefresh table="messages" />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <AdminInbox messages={messages ?? []} />
        </div>
      </div>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  // Compute cooldown for rate limiting
  let canSendAfter: string | null = null;
  if (messages && messages.length > 0) {
    const latestAt = new Date(messages[0].created_at).getTime();
    const cooldownEnd = latestAt + 60 * 60 * 1000;
    if (cooldownEnd > Date.now()) {
      canSendAfter = new Date(cooldownEnd).toISOString();
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <UserInbox messages={messages ?? []} canSendAfter={canSendAfter} userId={user.id} />
      </div>
    </div>
  );
}
