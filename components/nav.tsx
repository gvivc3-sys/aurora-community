import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";
import NavInner from "@/components/nav-inner";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasActiveSub = false;
  if (user) {
    const appMeta = (user as { app_metadata?: { role?: string; access_granted?: boolean } }).app_metadata;
    if (appMeta?.role === "admin" || appMeta?.access_granted) {
      hasActiveSub = true;
    } else {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();
      hasActiveSub = sub?.status === "active" || sub?.status === "past_due";
    }
  }

  let unreadCount = 0;
  if (user && isAdmin(user)) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");
    unreadCount = count ?? 0;
  }

  let unreadNotificationCount = 0;
  if (user) {
    const { count } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);
    unreadNotificationCount = count ?? 0;
  }

  return (
    <NavInner
      user={
        user
          ? {
              email: user.email ?? "",
              username: user.user_metadata?.username ?? null,
              avatarUrl: user.user_metadata?.avatar_url ?? null,
              isAdmin: isAdmin(user),
            }
          : null
      }
      hasActiveSub={hasActiveSub}
      unreadInboxCount={unreadCount}
      unreadNotificationCount={unreadNotificationCount}
    />
  );
}
