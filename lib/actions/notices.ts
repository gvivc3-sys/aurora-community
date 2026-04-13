"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin as _supabaseAdmin } from "@/lib/supabase/admin";

// Cast away strict table types until `notices` is added to the generated types
// (run the SQL migration in Supabase, then regenerate types to remove this cast)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAdmin = _supabaseAdmin as any;
import { isAdmin } from "@/lib/roles";
import { revalidatePath } from "next/cache";

type NoticeBg = "default" | "amber" | "rose" | "fuchsia" | "green";

export async function upsertNotice({ body, bg }: { body: string; bg: NoticeBg }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) return { error: "Unauthorized" };

  // Deactivate all existing notices first
  await supabaseAdmin.from("notices").update({ active: false }).eq("active", true);

  // Insert new active notice
  const { error } = await supabaseAdmin
    .from("notices")
    .insert({ body, bg, active: true });

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/management");
}

export async function deactivateNotice() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) return { error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("notices")
    .update({ active: false })
    .eq("active", true);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/management");
}

export async function getActiveNotice() {
  const { data } = await supabaseAdmin
    .from("notices")
    .select("id, body, bg")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}
