import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import NavInner from "@/components/nav-inner";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    />
  );
}
