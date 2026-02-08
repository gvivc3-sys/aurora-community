"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(previousState: unknown, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUp(previousState: unknown, formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Supabase returns a user with empty identities when the email is already taken
  // (security measure to avoid revealing which emails are registered)
  if (data.user?.identities?.length === 0) {
    return { error: "An account with this email already exists. Try logging in." };
  }

  redirect("/login?message=Check your email to confirm your account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(
  previousState: unknown,
  formData: FormData,
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  );

  if (error) {
    return { error: error.message };
  }

  redirect("/login?message=Check your email for a reset link");
}
