"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function acceptTerms() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabaseAdmin
    .from("subscriptions")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("user_id", user.id);

  redirect("/dashboard");
}
