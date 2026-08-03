import { supabaseAdmin } from "@/lib/supabase/admin";
import { getProfileCompletion } from "@/lib/profile-completion";

export type UserIdentity = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  verified: boolean;
};

export async function getUserIdentity(userId: string): Promise<UserIdentity> {
  const [{ data: handle }, { data: authUser }] = await Promise.all([
    supabaseAdmin
      .from("user_handles")
      .select("display_name, avatar_url")
      .eq("user_id", userId)
      .maybeSingle(),
    supabaseAdmin.auth.admin.getUserById(userId),
  ]);

  const meta = authUser?.user?.user_metadata ?? {};

  return {
    userId,
    name: handle?.display_name || meta.username || "Member",
    avatarUrl: handle?.avatar_url || meta.custom_avatar_url || meta.avatar_url || null,
    verified: getProfileCompletion(meta).isComplete,
  };
}
