import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";

export async function getSubscriptionStatus(): Promise<{
  isSubscribed: boolean;
  status: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isSubscribed: false, status: null };

  // Admins always have access
  if (isAdmin(user)) return { isSubscribed: true, status: "admin" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single();

  const active = sub?.status === "active" || sub?.status === "past_due";
  return { isSubscribed: active, status: sub?.status ?? null };
}
