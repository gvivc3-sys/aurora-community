import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (q.length < 1) {
    return NextResponse.json([]);
  }

  const [byHandle, byDisplayName] = await Promise.all([
    supabaseAdmin
      .from("user_handles")
      .select("user_id, handle, display_name, avatar_url")
      .ilike("handle", `${q}%`)
      .limit(8),
    supabaseAdmin
      .from("user_handles")
      .select("user_id, handle, display_name, avatar_url")
      .ilike("display_name", `%${q}%`)
      .limit(8),
  ]);

  if (byHandle.error) {
    return NextResponse.json({ error: byHandle.error.message }, { status: 500 });
  }
  if (byDisplayName.error) {
    return NextResponse.json({ error: byDisplayName.error.message }, { status: 500 });
  }

  const seen = new Set<string>();
  const results = [...byHandle.data, ...byDisplayName.data].filter((row) => {
    if (seen.has(row.user_id)) return false;
    seen.add(row.user_id);
    return true;
  });

  return NextResponse.json(results.slice(0, 8));
}
