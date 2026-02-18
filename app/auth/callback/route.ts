import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/emails";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email && data.user.created_at) {
        const createdAt = new Date(data.user.created_at).getTime();
        const isNew = Date.now() - createdAt < 10 * 60 * 1000;
        if (isNew) {
          sendWelcomeEmail(data.user.email);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?message=Could not authenticate user`,
  );
}
