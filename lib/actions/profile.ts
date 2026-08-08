"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidHandle, generateHandle } from "@/lib/handle";

const IDENTITY_COOLDOWN_MS = 48 * 60 * 60 * 1000; // 48 hours
const AVATAR_COOLDOWN_MS = 48 * 60 * 60 * 1000; // 48 hours

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

function isWithinCooldown(changedAt: string | undefined, cooldownMs: number = IDENTITY_COOLDOWN_MS): boolean {
  if (!changedAt) return false;
  return Date.now() - new Date(changedAt).getTime() < cooldownMs;
}

export async function updateProfile(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();

  const username = (formData.get("username") as string)?.trim();
  const birthday = formData.get("birthday") as string;
  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const instagramOptedOut = formData.get("instagram_opted_out") === "on";
  const rawInstagram = instagramOptedOut
    ? ""
    : ((formData.get("instagram_handle") as string)?.trim().replace(/^@/, "") ?? "");
  const rawHandle = (formData.get("handle") as string)?.trim().toLowerCase() ?? "";
  const locationCity = (formData.get("location_city") as string)?.trim() ?? "";
  const locationLat = formData.get("location_lat") as string;
  const locationLng = formData.get("location_lng") as string;

  if (birthday) {
    const date = new Date(birthday);
    const now = new Date();
    if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date > now) {
      return { error: "Please enter a valid birthday." };
    }
  }

  if (username && username.length > 16) {
    return { error: "Username must be 16 characters or fewer." };
  }

  if (username && /\s/.test(username)) {
    return { error: "Username cannot contain spaces." };
  }

  if (rawInstagram && !/^[a-zA-Z0-9._]{1,30}$/.test(rawInstagram)) {
    return { error: "Instagram handle must be 1-30 characters (letters, numbers, periods, underscores)." };
  }

  if (!rawInstagram && !instagramOptedOut) {
    return { error: "Add your Instagram handle, or opt out of sharing it." };
  }

  const lat = locationCity ? Number(locationLat) : NaN;
  const lng = locationCity ? Number(locationLng) : NaN;
  if (locationCity && (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) {
    return { error: "Invalid location. Please pick your city again." };
  }

  // Fetch current user to detect identity changes
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const oldUsername = user.user_metadata?.username;
  const usernameChanged = username && username !== oldUsername;

  if (usernameChanged) {
    if (isWithinCooldown(user.user_metadata?.name_changed_at)) {
      return { error: "You can only change your name once every 48 hours." };
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
      instagram_handle: rawInstagram,
      instagram_opted_out: instagramOptedOut,
      location_city: locationCity || undefined,
      location_lat: locationCity ? lat : undefined,
      location_lng: locationCity ? lng : undefined,
      handle: handle || undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Upsert user_handles
  if (handle) {
    const avatarUrl = user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? null;
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
    const avatarUrl = user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? "";
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

  if (isWithinCooldown(user.user_metadata?.avatar_changed_at, AVATAR_COOLDOWN_MS)) {
    return { error: "You can only change your avatar once every 48 hours." };
  }

  const name = user.user_metadata?.username ?? "";
  const avatarUrl = user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? "";

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
