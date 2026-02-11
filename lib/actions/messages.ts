"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";

export async function sendMessage(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    return { error: "Message cannot be empty." };
  }
  if (body.length > 2000) {
    return { error: "Message must be 2000 characters or less." };
  }

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    sender_name: user.user_metadata?.username ?? user.email,
    sender_avatar_url: user.user_metadata?.avatar_url ?? null,
    body,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inbox");
  return { success: true };
}

export async function markAsRead(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can mark messages as read." };
  }

  const messageId = formData.get("messageId") as string;
  if (!messageId) {
    return { error: "Message ID is required." };
  }

  const { error } = await supabase
    .from("messages")
    .update({ status: "read" })
    .eq("id", messageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inbox");
  return { success: true };
}

export async function markAsAddressed(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can mark messages as addressed." };
  }

  const messageId = formData.get("messageId") as string;
  if (!messageId) {
    return { error: "Message ID is required." };
  }

  const { error } = await supabase
    .from("messages")
    .update({ status: "addressed" })
    .eq("id", messageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inbox");
  return { success: true };
}
