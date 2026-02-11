import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import NavInner from "@/components/nav-inner";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadCount = 0;
  if (user && isAdmin(user)) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");
    unreadCount = count ?? 0;
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
      unreadInboxCount={unreadCount}
    />
  );
}
