"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidHandle, generateHandle } from "@/lib/handle";

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

function isWithinCooldown(changedAt: string | undefined): boolean {
  if (!changedAt) return false;
  return Date.now() - new Date(changedAt).getTime() < IDENTITY_COOLDOWN_MS;
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
  const rawHandle = (formData.get("handle") as string)?.trim().toLowerCase() ?? "";

  if (birthday) {
    const date = new Date(birthday);
    const now = new Date();
    if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date > now) {
      return { error: "Please enter a valid birthday." };
    }
  }

  if (rawTelegram && !/^[a-zA-Z0-9_]{5,32}$/.test(rawTelegram)) {
    return { error: "Telegram handle must be 5-32 characters (letters, numbers, underscores)." };
  }

  // Fetch current user to detect identity changes
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const oldUsername = user.user_metadata?.username;
  const usernameChanged = username && username !== oldUsername;

  if (usernameChanged) {
    if (isWithinCooldown(user.user_metadata?.name_changed_at)) {
      return { error: "You can only change your name once per week." };
    }
  }

  // Handle logic
  let handle = rawHandle;

  // If no handle provided, check if user already has one; if not, auto-generate
  if (!handle) {
    const { data: existingHandle } = await supabaseAdmin
      .from("user_handles")
      .select("handle")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingHandle) {
      // Auto-generate from display name
      const nameForHandle = username || oldUsername || user.email?.split("@")[0] || "user";
      handle = generateHandle(nameForHandle);

      // Ensure uniqueness by appending random digits if needed
      const { data: conflict } = await supabaseAdmin
        .from("user_handles")
        .select("handle")
        .eq("handle", handle)
        .maybeSingle();

      if (conflict) {
        handle = handle.slice(0, 10) + "_" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      }
    } else {
      handle = existingHandle.handle;
    }
  }

  // Validate handle format
  if (handle && !isValidHandle(handle)) {
    return { error: "Handle must be 3-14 characters, start with a letter, and contain only lowercase letters, numbers, and underscores." };
  }

  // Check uniqueness (exclude self)
  if (handle) {
    const { data: taken } = await supabaseAdmin
      .from("user_handles")
      .select("user_id")
      .eq("handle", handle)
      .neq("user_id", user.id)
      .maybeSingle();

    if (taken) {
      return { error: "That handle is already taken. Please choose another." };
    }
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      username: username || undefined,
      birthday: birthday || undefined,
      bio: bio.slice(0, 300) || undefined,
      telegram_handle: rawTelegram || undefined,
      handle: handle || undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Upsert user_handles
  if (handle) {
    const avatarUrl = user.user_metadata?.avatar_url ?? null;
    const displayName = username || oldUsername || null;

    await supabaseAdmin
      .from("user_handles")
      .upsert({
        user_id: user.id,
        handle,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
  }

  if (usernameChanged) {
    const avatarUrl = user.user_metadata?.avatar_url ?? "";
    await backfillIdentity(user.id, username, avatarUrl);
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: { name_changed_at: new Date().toISOString() },
    });

    // Also update display_name in user_handles
    if (handle) {
      await supabaseAdmin
        .from("user_handles")
        .update({ display_name: username })
        .eq("user_id", user.id);
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  if (isWithinCooldown(user.user_metadata?.avatar_changed_at)) {
    return { error: "You can only change your avatar once per week." };
  }

  const name = user.user_metadata?.username ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";

  await backfillIdentity(user.id, name, avatarUrl);
  await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { avatar_changed_at: new Date().toISOString() },
  });

  // Also update avatar_url in user_handles
  await supabaseAdmin
    .from("user_handles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  revalidatePath("/", "layout");
  return { success: true };
}
