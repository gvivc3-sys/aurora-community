"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVideoId } from "@/lib/video";

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

  if (type === "video") {
    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return { error: "Title is required." };
    }
    if (title.length > 200) {
      return { error: "Title must be 200 characters or less." };
    }

    const videoUrl = formData.get("video_url") as string;
    const video = extractVideoId(videoUrl || "");
    if (!video) {
      return { error: "Please enter a valid YouTube or Vimeo URL." };
    }

    const { error } = await supabase.from("posts").insert({
      type: "video",
      title,
      video_url: videoUrl,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
    });

    if (error) {
      return { error: error.message };
    }
  } else if (type === "text") {
    const body = (formData.get("body") as string)?.trim();
    if (!body) {
      return { error: "Post body is required." };
    }
    if (body.length > 500) {
      return { error: "Post body must be 500 characters or less." };
    }

    const { error } = await supabase.from("posts").insert({
      type: "text",
      body,
      author_id: user.id,
      author_name: user.user_metadata?.username ?? user.email,
      author_avatar_url: user.user_metadata?.avatar_url ?? null,
    });

    if (error) {
      return { error: error.message };
    }
  } else {
    return { error: "Invalid post type." };
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
