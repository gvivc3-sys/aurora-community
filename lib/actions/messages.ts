"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { parseReplies } from "@/lib/replies";
import { extractMentionsFromHtml, extractMentionsFromText, resolveHandlesToUserIds, linkifyMentionsInHtml } from "@/lib/mentions";
import { createMentionNotifications } from "@/lib/actions/notifications";

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

  const anonymous = formData.get("anonymous") === "on";

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    sender_name: anonymous ? null : (user.user_metadata?.username ?? user.email),
    sender_avatar_url: anonymous ? null : (user.user_metadata?.avatar_url ?? null),
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
  const rawReplyBody = (formData.get("replyBody") as string)?.trim();
  const mode = formData.get("mode") as string;

  if (!messageId) {
    return { error: "Message ID is required." };
  }
  if (!rawReplyBody) {
    return { error: "Reply cannot be empty." };
  }

  // Linkify @mentions in the reply HTML
  const replyBody = await linkifyMentionsInHtml(rawReplyBody);

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

  // Build replies array (append to existing replies)
  const existingReplies = parseReplies(message.reply_body);
  existingReplies.push({
    body: replyBody,
    created_at: new Date().toISOString(),
    mode: mode === "public" ? "public" : "private",
    author_name: user.user_metadata?.username ?? user.email ?? "Admin",
    role: "admin",
  });

  // Update the message status and store the replies
  const { error: updateError } = await supabase
    .from("messages")
    .update({
      status: "addressed",
      reply_body: JSON.stringify(existingReplies),
    })
    .eq("id", messageId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Extract mentions from the reply HTML and create notifications
  const mentionedUserIds = extractMentionsFromHtml(replyBody);
  if (mentionedUserIds.length > 0) {
    await createMentionNotifications({
      actorId: user.id,
      actorName: user.user_metadata?.username ?? user.email ?? null,
      actorAvatarUrl: user.user_metadata?.avatar_url ?? null,
      mentionedUserIds,
      type: "mention_reply",
      resourceType: "message",
      resourceId: messageId,
      bodyPreview: replyBody.replace(/<[^>]*>/g, "").slice(0, 200),
    });
  }

  revalidatePath("/inbox");
  revalidatePath("/dashboard");
  return { success: true, mode: mode === "public" ? "public" : "private" };
}

export async function replyToReply(
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

  const messageId = formData.get("messageId") as string;
  const replyBody = (formData.get("replyBody") as string)?.trim();

  if (!messageId) {
    return { error: "Message ID is required." };
  }
  if (!replyBody) {
    return { error: "Reply cannot be empty." };
  }
  if (replyBody.length > 500) {
    return { error: "Reply must be 500 characters or less." };
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

  // Only the original sender can reply
  if (message.sender_id !== user.id) {
    return { error: "You can only reply to your own whispers." };
  }

  // Append user reply
  const existingReplies = parseReplies(message.reply_body);
  existingReplies.push({
    body: replyBody,
    created_at: new Date().toISOString(),
    mode: "private",
    author_name: user.user_metadata?.username ?? user.email ?? "User",
    role: "user",
  });

  // Update message: set status to unread so admin sees the new reply
  const { error: updateError } = await supabase
    .from("messages")
    .update({
      status: "unread",
      reply_body: JSON.stringify(existingReplies),
    })
    .eq("id", messageId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Extract mentions from plaintext reply and create notifications
  const handles = extractMentionsFromText(replyBody);
  if (handles.length > 0) {
    const mentionedUserIds = await resolveHandlesToUserIds(handles);
    if (mentionedUserIds.length > 0) {
      await createMentionNotifications({
        actorId: user.id,
        actorName: user.user_metadata?.username ?? user.email ?? null,
        actorAvatarUrl: user.user_metadata?.avatar_url ?? null,
        mentionedUserIds,
        type: "mention_reply",
        resourceType: "message",
        resourceId: messageId,
        bodyPreview: replyBody.slice(0, 200),
      });
    }
  }

  revalidatePath("/inbox");
  return { success: true };
}
