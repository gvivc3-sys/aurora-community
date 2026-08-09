import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { supabaseAdmin } from "@/lib/supabase/admin";
import NavInner from "@/components/nav-inner";
import PageShell from "@/components/page-shell";
import { ToastProvider } from "@/components/toast";
import { IOSInstallBanner } from "@/components/install-prompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#2a241b",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "Aurora: A Private Sanctuary for Women",
  description: "A private membership circle for women reclaiming their health, feminine energy, and radiance, through nourishment, natural beauty, and the power of sisterhood.",
  openGraph: {
    title: "Aurora: A Private Sanctuary for Women",
    description: "A private membership circle for women reclaiming their health, feminine energy, and radiance, through nourishment, natural beauty, and the power of sisterhood.",
    type: "website",
    images: [{ url: "https://myaurora.io/images/opengraph.jpg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aurora",
  },
  icons: {
    icon: "/icon.png?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasActiveSub = false;
  if (user) {
    const appMeta = (user as { app_metadata?: { role?: string; access_granted?: boolean } }).app_metadata;
    if (appMeta?.role === "admin" || appMeta?.access_granted) {
      hasActiveSub = true;
    } else {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();
      hasActiveSub = sub?.status === "active" || sub?.status === "past_due";
    }
  }

  let unreadNotificationCount = 0;
  if (user) {
    const { count } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);
    unreadNotificationCount = count ?? 0;
  }

  const isMember = hasActiveSub && !!user;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <ToastProvider>
          <NavInner
            user={
              user
                ? {
                    email: user.email ?? "",
                    username: user.user_metadata?.username ?? null,
                    avatarUrl: user.user_metadata?.custom_avatar_url ?? user.user_metadata?.avatar_url ?? null,
                    isAdmin: isAdmin(user),
                  }
                : null
            }
            hasActiveSub={hasActiveSub}
            unreadNotificationCount={unreadNotificationCount}
          />
          <PageShell isMember={isMember}>{children}</PageShell>
          <IOSInstallBanner />
        </ToastProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js?v=3")}`,
          }}
        />
      </body>
    </html>
  );
}
