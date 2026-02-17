"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
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

  // Rate limit: 1 message per hour
  const { data: lastMessage } = await supabase
    .from("messages")
    .select("created_at")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (lastMessage) {
    const elapsed = Date.now() - new Date(lastMessage.created_at).getTime();
    const cooldown = 60 * 60 * 1000; // 1 hour
    if (elapsed < cooldown) {
      const remaining = Math.ceil((cooldown - elapsed) / 60000);
      return { error: `You can send another question in ${remaining}m.` };
    }
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

export async function replyToMessage(
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
    return { error: "Only admins can reply to messages." };
  }

  const messageId = formData.get("messageId") as string;
  const replyBody = (formData.get("replyBody") as string)?.trim();
  const mode = formData.get("mode") as string;

  if (!messageId) {
    return { error: "Message ID is required." };
  }
  if (!replyBody) {
    return { error: "Reply cannot be empty." };
  }

  // Fetch original message
  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (fetchError || !message) {
    return { error: "Message not found." };
  }

  if (mode === "public") {
    // Create a post in the Circle feed with the admin's reply
    const { error: postError } = await supabaseAdmin.from("posts").insert({
      type: "text",
      body: replyBody,
      anonymous_question: message.body,
      tag: "ask",
      comments_enabled: true,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
    });

    if (postError) {
      return { error: postError.message };
    }
  }

  // Update the message status and store the reply
  const { error: updateError } = await supabase
    .from("messages")
    .update({ status: "addressed", reply_body: replyBody })
    .eq("id", messageId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/inbox");
  revalidatePath("/dashboard");
  return { success: true, mode: mode === "public" ? "public" : "private" };
}
