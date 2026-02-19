"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const IDENTITY_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

async function backfillIdentity(
  userId: string,
  name: string,
  avatarUrl: string,
) {
  await Promise.all([
    supabaseAdmin
      .from("posts")
      .update({ author_name: name, author_avatar_url: avatarUrl })
      .eq("author_id", userId),
    supabaseAdmin
      .from("comments")
      .update({ author_name: name, author_avatar_url: avatarUrl })
      .eq("user_id", userId),
    supabaseAdmin
      .from("messages")
      .update({ sender_name: name, sender_avatar_url: avatarUrl })
      .eq("sender_id", userId),
  ]);
}

function isWithinCooldown(identityChangedAt: string | undefined): boolean {
  if (!identityChangedAt) return false;
  return Date.now() - new Date(identityChangedAt).getTime() < IDENTITY_COOLDOWN_MS;
}

export async function updateProfile(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const birthday = formData.get("birthday") as string;
  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const rawTelegram = (formData.get("telegram_handle") as string)?.trim().replace(/^@/, "") ?? "";

  if (birthday) {
    const date = new Date(birthday);
    const now = new Date();
    if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date > now) {
      return { error: "Please enter a valid birthday." };
    }
  }

  if (rawTelegram && !/^[a-zA-Z0-9_]{5,32}$/.test(rawTelegram)) {
    return { error: "Telegram handle must be 5–32 characters (letters, numbers, underscores)." };
  }

  // Fetch current user to detect identity changes
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const oldUsername = user.user_metadata?.username;
  const usernameChanged = username && username !== oldUsername;

  if (usernameChanged) {
    if (isWithinCooldown(user.user_metadata?.identity_changed_at)) {
      return { error: "You can only change your name or avatar once per week." };
    }
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      username: username || undefined,
      birthday: birthday || undefined,
      bio: bio.slice(0, 300) || undefined,
      telegram_handle: rawTelegram || undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (usernameChanged) {
    const avatarUrl = user.user_metadata?.avatar_url ?? "";
    await backfillIdentity(user.id, username, avatarUrl);
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: { identity_changed_at: new Date().toISOString() },
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  if (isWithinCooldown(user.user_metadata?.identity_changed_at)) {
    return { error: "You can only change your name or avatar once per week." };
  }

  const name = user.user_metadata?.username ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";

  await backfillIdentity(user.id, name, avatarUrl);
  await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { identity_changed_at: new Date().toISOString() },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
