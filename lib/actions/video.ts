"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVimeoId } from "@/lib/vimeo";

export async function postVideo(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can post videos." };
  }

  const title = (formData.get("title") as string)?.trim();
  if (!title) {
    return { error: "Title is required." };
  }
  if (title.length > 200) {
    return { error: "Title must be 200 characters or less." };
  }

  const vimeoUrl = formData.get("vimeo_url") as string;
  const vimeoId = extractVimeoId(vimeoUrl || "");
  if (!vimeoId) {
    return { error: "Please enter a valid Vimeo URL." };
  }

  const { error } = await supabase.from("videos").insert({
    title,
    vimeo_url: vimeoUrl,
    author_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteVideo(previousState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (!isAdmin(user)) {
    return { error: "Only admins can delete videos." };
  }

  const videoId = formData.get("videoId") as string;
  if (!videoId) {
    return { error: "Video ID is required." };
  }

  const { error } = await supabase.from("videos").delete().eq("id", videoId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
