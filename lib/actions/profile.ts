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

  if (birthday) {
    const date = new Date(birthday);
    const now = new Date();
    if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date > now) {
      return { error: "Please enter a valid birthday." };
    }
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      username: username || undefined,
      birthday: birthday || undefined,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
