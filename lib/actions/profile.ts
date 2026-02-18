"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const birthday = formData.get("birthday") as string;
  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const rawTelegram = (formData.get("telegram_handle") as string)?.trim().replace(/^@/, "") ?? "";

  if (birthday) {
    const date = new Date(birthday);
    const now = new Date();
    if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date > now) {
      return { error: "Please enter a valid birthday." };
    }
  }

  if (rawTelegram && !/^[a-zA-Z0-9_]{5,32}$/.test(rawTelegram)) {
    return { error: "Telegram handle must be 5–32 characters (letters, numbers, underscores)." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      username: username || undefined,
      birthday: birthday || undefined,
      bio: bio.slice(0, 300) || undefined,
      telegram_handle: rawTelegram || undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
