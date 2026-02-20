"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVideoId } from "@/lib/video";
import { extractMentionsFromHtml, extractMentionsFromText, resolveHandlesToUserIds } from "@/lib/mentions";
import { createMentionNotifications } from "@/lib/actions/notifications";

export async function createPost(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can create posts." };
  }

  const type = formData.get("type") as string;
  const tag = formData.get("tag") as string;
  if (!tag || !["love", "health", "magic"].includes(tag)) {
    return { error: "Please select a tag." };
  }

  const commentsEnabled = formData.get("comments_enabled") === "on";

  // Tiptap outputs "<p></p>" for empty content
  function isEmptyHtml(html: string) {
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  }

  function stripTags(html: string) {
    return html.replace(/<[^>]*>/g, "");
  }

  let insertedPostId: string | null = null;
  let bodyForMentions: string | null = null;

  if (type === "video") {
    const videoUrl = formData.get("video_url") as string;
    const video = extractVideoId(videoUrl || "");
    if (!video) {
      return { error: "Please enter a valid YouTube or Vimeo URL." };
    }

    const rawBody = (formData.get("body") as string)?.trim() || "";
    const description = isEmptyHtml(rawBody) ? null : rawBody;
    bodyForMentions = description;

    const { data, error } = await supabase.from("posts").insert({
      type: "video",
      body: description,
      video_url: videoUrl,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
      tag: tag as "love" | "health" | "magic",
      comments_enabled: commentsEnabled,
    }).select("id").single();

    if (error) {
      return { error: error.message };
    }
    insertedPostId = data.id;
  } else if (type === "text") {
    const body = (formData.get("body") as string)?.trim();
    if (!body || isEmptyHtml(body)) {
      return { error: "Post body is required." };
    }
    if (stripTags(body).length > 300) {
      return {
        error:
          "Text posts are limited to 300 characters. Try using an Article post for longer content.",
      };
    }
    bodyForMentions = body;

    const { data, error } = await supabase.from("posts").insert({
      type: "text",
      body,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
      tag: tag as "love" | "health" | "magic",
      comments_enabled: commentsEnabled,
    }).select("id").single();

    if (error) {
      return { error: error.message };
    }
    insertedPostId = data.id;
  } else if (type === "article") {
    const body = (formData.get("body") as string)?.trim();
    if (!body || isEmptyHtml(body)) {
      return { error: "Article body is required." };
    }

    const title = (formData.get("title") as string)?.trim() || null;
    bodyForMentions = body;

    const { data, error } = await supabase.from("posts").insert({
      type: "article",
      title,
      body,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
      tag: tag as "love" | "health" | "magic",
      comments_enabled: commentsEnabled,
    }).select("id").single();

    if (error) {
      return { error: error.message };
    }
    insertedPostId = data.id;
  } else if (type === "voice") {
    const audioFile = formData.get("audio") as File | null;
    if (!audioFile || audioFile.size === 0) {
      return { error: "Please record or upload an audio file." };
    }
    if (!audioFile.type.startsWith("audio/")) {
      return { error: "File must be an audio format." };
    }
    if (audioFile.size > 10 * 1024 * 1024) {
      return { error: "Audio file must be under 10 MB." };
    }

    const title = (formData.get("title") as string)?.trim() || null;
    const body = (formData.get("body") as string)?.trim() || null;
    bodyForMentions = body;
    const postId = crypto.randomUUID();
    const ext = audioFile.name?.split(".").pop() || "webm";
    const filePath = `audio/${postId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(filePath, audioFile, {
        contentType: audioFile.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("audio")
      .getPublicUrl(filePath);

    const { data, error } = await supabase.from("posts").insert({
      id: postId,
      type: "voice",
      title,
      body,
      audio_url: publicUrlData.publicUrl,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
      tag: tag as "love" | "health" | "magic",
      comments_enabled: commentsEnabled,
    }).select("id").single();

    if (error) {
      return { error: error.message };
    }
    insertedPostId = data.id;
  } else {
    return { error: "Invalid post type." };
  }

  // Extract mentions and create notifications
  if (insertedPostId && bodyForMentions) {
    const mentionedUserIds = extractMentionsFromHtml(bodyForMentions);
    if (mentionedUserIds.length > 0) {
      await createMentionNotifications({
        actorId: user.id,
        actorName: user.user_metadata?.username ?? user.email ?? null,
        actorAvatarUrl: user.user_metadata?.avatar_url ?? null,
        mentionedUserIds,
        type: "mention_post",
        resourceType: "post",
        resourceId: insertedPostId,
        bodyPreview: stripTags(bodyForMentions).slice(0, 200),
      });
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePost(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can delete posts." };
  }

  const postId = formData.get("postId") as string;
  if (!postId) {
    return { error: "Post ID is required." };
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleLike(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", liked: false };
  }

  const postId = formData.get("postId") as string;
  if (!postId) {
    return { error: "Post ID is required.", liked: false };
  }

  // Check if like exists
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: error.message, liked: true };
    }

    revalidatePath("/dashboard");
    return { liked: false };
  } else {
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      return { error: error.message, liked: false };
    }

    revalidatePath("/dashboard");
    return { liked: true };
  }
}

export async function addComment(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const postId = formData.get("postId") as string;
  if (!postId) {
    return { error: "Post ID is required." };
  }

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    return { error: "Comment cannot be empty." };
  }
  if (body.length > 500) {
    return { error: "Comment must be 500 characters or less." };
  }

  const { data, error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    author_name: user.user_metadata?.username ?? user.email,
    author_avatar_url: user.user_metadata?.avatar_url ?? null,
    body,
  }).select("id").single();

  if (error) {
    return { error: error.message };
  }

  // Extract mentions from plaintext comment and create notifications
  const handles = extractMentionsFromText(body);
  if (handles.length > 0) {
    const mentionedUserIds = await resolveHandlesToUserIds(handles);
    if (mentionedUserIds.length > 0) {
      await createMentionNotifications({
        actorId: user.id,
        actorName: user.user_metadata?.username ?? user.email ?? null,
        actorAvatarUrl: user.user_metadata?.avatar_url ?? null,
        mentionedUserIds,
        type: "mention_comment",
        resourceType: "comment",
        resourceId: data.id,
        bodyPreview: body.slice(0, 200),
      });
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteComment(
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

  const commentId = formData.get("commentId") as string;
  if (!commentId) {
    return { error: "Comment ID is required." };
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleBookmark(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in.", bookmarked: false };
  }

  const postId = formData.get("postId") as string;
  if (!postId) {
    return { error: "Post ID is required.", bookmarked: false };
  }

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    revalidatePath("/dashboard");
    revalidatePath("/bookmarks");
    return { bookmarked: false };
  } else {
    await supabase
      .from("bookmarks")
      .insert({ post_id: postId, user_id: user.id });
    revalidatePath("/dashboard");
    revalidatePath("/bookmarks");
    return { bookmarked: true };
  }
}
