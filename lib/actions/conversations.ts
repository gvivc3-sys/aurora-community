"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { extractMentionsFromText, resolveHandlesToUserIds } from "@/lib/mentions";
import { createMentionNotifications } from "@/lib/actions/notifications";

const MAX_THREADS = 15;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function uploadImage(file: File): Promise<{ fileUrl: string; fileType: string } | { error: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Image must be under 10 MB." };
  }

  const ext = file.name?.split(".").pop() || "bin";
  const filePath = `${crypto.randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("files")
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: `Image upload failed: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from("files").getPublicUrl(filePath);
  return { fileUrl: publicUrlData.publicUrl, fileType: file.type };
}

async function notifyMentions(body: string, actorId: string, actorName: string | null, actorAvatarUrl: string | null, threadId: string, type: "mention_thread" | "mention_thread_reply") {
  const handles = extractMentionsFromText(body);
  if (handles.length === 0) return;
  const mentionedUserIds = await resolveHandlesToUserIds(handles);
  if (mentionedUserIds.length === 0) return;

  await createMentionNotifications({
    actorId,
    actorName,
    actorAvatarUrl,
    mentionedUserIds,
    type,
    resourceType: "thread",
    resourceId: threadId,
    bodyPreview: body.slice(0, 200),
  });
}

async function enforceThreadCap() {
  const { count } = await supabaseAdmin.from("threads").select("*", { count: "exact", head: true });
  if (!count || count <= MAX_THREADS) return;

  const { data: overflow } = await supabaseAdmin
    .from("threads")
    .select("id")
    .order("bumped_at", { ascending: true })
    .limit(count - MAX_THREADS);

  if (overflow && overflow.length > 0) {
    await supabaseAdmin.from("threads").delete().in("id", overflow.map((t) => t.id));
  }
}

export async function createThread(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const title = (formData.get("title") as string)?.trim();
  if (!title) {
    return { error: "Title is required." };
  }
  if (title.length > 120) {
    return { error: "Title must be 120 characters or less." };
  }

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    return { error: "Body is required." };
  }
  if (body.length > 2000) {
    return { error: "Body must be 2000 characters or less." };
  }

  let fileUrl: string | null = null;
  let fileType: string | null = null;
  const file = formData.get("file") as File | null;
  if (file && file.size > 0) {
    const uploaded = await uploadImage(file);
    if ("error" in uploaded) {
      return { error: uploaded.error };
    }
    fileUrl = uploaded.fileUrl;
    fileType = uploaded.fileType;
  }

  const authorName = user.user_metadata?.username ?? user.email ?? null;
  const authorAvatarUrl = user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? null;

  const { data, error } = await supabase
    .from("threads")
    .insert({
      author_id: user.id,
      author_name: authorName,
      author_avatar_url: authorAvatarUrl,
      title,
      body,
      file_url: fileUrl,
      file_type: fileType,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await notifyMentions(body, user.id, authorName, authorAvatarUrl, data.id, "mention_thread");
  await enforceThreadCap();

  revalidatePath("/conversations");
  return { success: true, threadId: data.id as string };
}

export async function replyToThread(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const threadId = formData.get("threadId") as string;
  if (!threadId) {
    return { error: "Thread ID is required." };
  }

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    return { error: "Reply cannot be empty." };
  }
  if (body.length > 1000) {
    return { error: "Reply must be 1000 characters or less." };
  }

  let fileUrl: string | null = null;
  let fileType: string | null = null;
  const file = formData.get("file") as File | null;
  if (file && file.size > 0) {
    const uploaded = await uploadImage(file);
    if ("error" in uploaded) {
      return { error: uploaded.error };
    }
    fileUrl = uploaded.fileUrl;
    fileType = uploaded.fileType;
  }

  const authorName = user.user_metadata?.username ?? user.email ?? null;
  const authorAvatarUrl = user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? null;

  const { error } = await supabase.from("thread_replies").insert({
    thread_id: threadId,
    author_id: user.id,
    author_name: authorName,
    author_avatar_url: authorAvatarUrl,
    body,
    file_url: fileUrl,
    file_type: fileType,
  });

  if (error) {
    return { error: error.message };
  }

  // Bump the thread to the top of the board.
  await supabaseAdmin.from("threads").update({ bumped_at: new Date().toISOString() }).eq("id", threadId);

  await notifyMentions(body, user.id, authorName, authorAvatarUrl, threadId, "mention_thread_reply");

  revalidatePath("/conversations");
  revalidatePath(`/conversations/${threadId}`);
  return { success: true };
}

export async function toggleThreadReaction(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", reacted: false };
  }

  const threadId = (formData.get("threadId") as string) || null;
  const replyId = (formData.get("replyId") as string) || null;
  if (!threadId && !replyId) {
    return { error: "Nothing to react to.", reacted: false };
  }

  let query = supabase.from("thread_reactions").select("id").eq("user_id", user.id);
  query = threadId ? query.eq("thread_id", threadId) : query.eq("reply_id", replyId as string);
  const { data: existing } = await query.maybeSingle();

  if (existing) {
    const { error } = await supabase.from("thread_reactions").delete().eq("id", existing.id);
    if (error) return { error: error.message, reacted: true };
    return { reacted: false };
  }

  const { error } = await supabase.from("thread_reactions").insert({
    user_id: user.id,
    thread_id: threadId,
    reply_id: replyId,
  });
  if (error) return { error: error.message, reacted: false };
  return { reacted: true };
}

export async function deleteThread(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const threadId = formData.get("threadId") as string;
  if (!threadId) {
    return { error: "Thread ID is required." };
  }

  if (!isAdmin(user)) {
    const { data: thread } = await supabase.from("threads").select("author_id").eq("id", threadId).single();
    if (!thread || thread.author_id !== user.id) {
      return { error: "You can only delete your own discussions." };
    }
  }

  const { error } = await supabaseAdmin.from("threads").delete().eq("id", threadId);
  if (error) return { error: error.message };

  revalidatePath("/conversations");
  return { success: true };
}

export async function deleteThreadReply(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const replyId = formData.get("replyId") as string;
  const threadId = formData.get("threadId") as string;
  if (!replyId) {
    return { error: "Reply ID is required." };
  }

  if (!isAdmin(user)) {
    const { data: reply } = await supabase.from("thread_replies").select("author_id").eq("id", replyId).single();
    if (!reply || reply.author_id !== user.id) {
      return { error: "You can only delete your own replies." };
    }
  }

  const { error } = await supabaseAdmin.from("thread_replies").delete().eq("id", replyId);
  if (error) return { error: error.message };

  if (threadId) revalidatePath(`/conversations/${threadId}`);
  return { success: true };
}
