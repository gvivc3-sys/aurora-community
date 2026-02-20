"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CreateMentionParams = {
  actorId: string;
  actorName: string | null;
  actorAvatarUrl: string | null;
  mentionedUserIds: string[];
  type: "mention_post" | "mention_comment" | "mention_reply";
  resourceType: "post" | "comment" | "message";
  resourceId: string;
  bodyPreview?: string;
};

/**
 * Create notification rows for each mentioned user (excluding the actor).
 */
export async function createMentionNotifications({
  actorId,
  actorName,
  actorAvatarUrl,
  mentionedUserIds,
  type,
  resourceType,
  resourceId,
  bodyPreview,
}: CreateMentionParams) {
  // Exclude self-mentions
  const recipients = mentionedUserIds.filter((id) => id !== actorId);
  if (recipients.length === 0) return;

  const rows = recipients.map((userId) => ({
    user_id: userId,
    type,
    actor_id: actorId,
    actor_name: actorName,
    actor_avatar_url: actorAvatarUrl,
    resource_type: resourceType,
    resource_id: resourceId,
    body_preview: bodyPreview?.slice(0, 200) ?? null,
  }));

  await supabaseAdmin.from("notifications").insert(rows);
}

export async function getNotifications(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

export async function markNotificationsRead(ids: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabaseAdmin
    .from("notifications")
    .update({ read: true })
    .in("id", ids)
    .eq("user_id", user.id);
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabaseAdmin
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
}
