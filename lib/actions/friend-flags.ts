"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserIdentity } from "@/lib/user-identity";

const MAX_LOCATION_LENGTH = 60;
const MAX_NOTE_LENGTH = 140;
const FLAG_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;

export type FriendFlag = {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  verified: boolean;
  location: string;
  note: string;
  createdAt: string;
  isMine: boolean;
};

export async function getActiveFriendFlags(): Promise<FriendFlag[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: flags } = await supabaseAdmin
    .from("friend_flags")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (!flags || flags.length === 0) return [];

  return Promise.all(
    flags.map(async (flag) => {
      const identity = await getUserIdentity(flag.user_id);
      return {
        id: flag.id,
        userId: flag.user_id,
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        verified: identity.verified,
        location: flag.location,
        note: flag.note,
        createdAt: flag.created_at,
        isMine: flag.user_id === user?.id,
      };
    }),
  );
}

export async function getMyFriendFlag() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("friend_flags")
    .select("*")
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return data;
}

export async function postFriendFlag(
  previousState: unknown,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const location = (formData.get("location") as string)?.trim() ?? "";
  const note = (formData.get("note") as string)?.trim() ?? "";

  if (!location) return { error: "Add your city or area." };
  if (location.length > MAX_LOCATION_LENGTH) {
    return { error: `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.` };
  }
  if (!note) return { error: "Add a short note about what you're looking for." };
  if (note.length > MAX_NOTE_LENGTH) {
    return { error: `Note must be ${MAX_NOTE_LENGTH} characters or fewer.` };
  }

  const { error } = await supabaseAdmin.from("friend_flags").upsert(
    {
      user_id: user.id,
      location,
      note,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + FLAG_LIFETIME_MS).toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { error: "Something went wrong. Please try again." };

  revalidatePath("/frequency");
  return { success: true };
}

export async function deleteMyFriendFlag() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabaseAdmin.from("friend_flags").delete().eq("user_id", user.id);
  revalidatePath("/frequency");
}
