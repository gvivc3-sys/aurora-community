import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// Routes that require an active subscription
const PROTECTED_ROUTES = ["/dashboard", "/chat", "/profile", "/inbox", "/bookmarks"];

// Exact public routes (matched with ===)
const PUBLIC_EXACT = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/update-password",
  "/auth/callback",
  "/subscribe",
];

// Prefix public routes (matched with startsWith)
const PUBLIC_PREFIXES = ["/api/", "/auth/"];

export async function proxy(request: NextRequest) {
  // Always refresh the Supabase session
  const { response, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Skip paywall for public routes and API routes
  if (
    PUBLIC_EXACT.includes(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
  ) {
    return response;
  }

  // Not logged in → redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check if this is a protected route that needs subscription
  const isProtected = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route),
  );

  if (!isProtected) {
    return response;
  }

  // Check admin status or granted access (bypass paywall)
  const appMetadata = (user as { app_metadata?: { role?: string; access_granted?: boolean } })
    .app_metadata;
  if (appMetadata?.role === "admin" || appMetadata?.access_granted) {
    return response;
  }

  // Check subscription status — default to blocking if anything fails
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (sub?.status === "active" || sub?.status === "past_due") {
      return response;
    }
  } catch (err) {
    console.error("Proxy subscription check failed:", err);
  }

  // No active subscription (or check failed) → redirect to subscribe
  const subscribeUrl = request.nextUrl.clone();
  subscribeUrl.pathname = "/subscribe";
  return NextResponse.redirect(subscribeUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
