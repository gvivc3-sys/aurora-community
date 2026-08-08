"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "@/lib/actions/auth";
import Avatar from "@/components/avatar";
import InstallPrompt from "@/components/install-prompt";
import { MEMBERSHIP_PRICE } from "@/lib/config";
import { UserCircleIcon, ChatBubbleIcon, BookmarkIcon, BookOpenIcon, ArrowRightOnRectangleIcon, UsersIcon, EnvelopeIcon, BellIcon, RectangleStackIcon, StarSolidIcon } from "@/components/icons";

function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-2 py-0.5 text-xs font-semibold text-amber-950 shadow-sm ${className}`}
    >
      <StarSolidIcon className="h-3 w-3" />
      Admin
    </span>
  );
}

type NavUser = {
  email: string;
  username: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
};

function AuroraWordmark({ className = "h-4 w-auto text-warm-600" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- vector logo, nothing for the image optimizer to do
    <img src="/images/aurora_rebrand_logo_colored.svg" alt="Aurora" className={className} />
  );
}

function PortalIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 258.22298 283.80057" className={`animate-[spin_12s_linear_infinite] ${className}`} fill="#5b4ec2">
      <path d="M257.08826,179.18199C219.48497,356.1381-28.9813,290.03619,2.80007,119.20064,14.26282,59.83959,64.89421,10.28182,124.54861.83252c10.6214-3.27536,22.24991,3.39539,22.19956,15.06622.00015,7.96598-5.90928,14.66283-13.80183,15.74607C-10.41877,53.49283,4.63344,270.06294,153.71203,250.64353c20.35698-4.20945,39.73611-16.08843,52.58595-32.042,38.87844-45.24125,17.97503-120.58777-42.38191-132.06891-20.73292-3.84051-44.23146,2.20129-58.85747,17.78997-26.92879,24.57781-23.98987,73.02894,10.01097,88.71939,50.9672,24.12123,80.02278-50.14195,32.55867-53.27997,5.79414,2.69217,9.7573,6.7851,10.93981,13.80016,4.07004,26.86157-34.76871,31.24146-45.8793,9.81855-20.54661-49.95095,49.5218-75.95895,79.41831-34.16748,18.30267,23.93839,13.12901,59.35308-8.31931,80.05857-54.34739,53.05058-143.55428-6.73916-127.32727-78.94152C90.85654-.7589,274.28501,50.91175,257.08826,179.18199Z"/>
    </svg>
  );
}

export default function NavInner({ user, hasActiveSub = false, unreadNotificationCount = 0 }: { user: NavUser | null; hasActiveSub?: boolean; unreadNotificationCount?: number }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isMember = hasActiveSub && !!user;
  const isConversationDetail = pathname?.startsWith("/messages/") ?? false;
  const isLandingPage = pathname === "/";
  // The sidebar/drawer app-shell only makes sense once a member is inside
  // the app; on the public landing page (even while logged in) it would
  // overlay the marketing content, so fall back to a plain marketing bar.
  const showAppChrome = isMember && !isLandingPage;

  // ESC to close mobile drawer
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const sidebarLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors hover:bg-warm-50 hover:text-warm-900 ${active ? "bg-warm-50 text-warm-900" : "text-warm-600"}`;

  return (
    <>
      {/* The conversation detail page renders its own compact header (back
          arrow + participants) and covers the full mobile viewport itself,
          so the top bar doesn't render there at all on mobile — avoids
          needing two separate fixed-position bars to stay in sync while
          the keyboard opens/closes. The desktop sidebar below is
          unaffected, since desktop has no on-screen keyboard to fight. */}
      {!isConversationDetail && (
      <nav className={`sticky top-0 z-50 border-b border-warm-200 bg-white ${showAppChrome ? "md:hidden" : ""}`}>
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          {/* Logo — desktop, only rendered here when there's no sidebar */}
          <Link href="/" className="group relative hidden md:block">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-fuchsia-200/40 to-pink-200/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <AuroraWordmark className="relative h-4 w-auto text-warm-600" />
          </Link>

          {/* Desktop bar — non-member states, plus members viewing the public landing page */}
          <div className="hidden items-center gap-4 md:flex">
            {isMember && isLandingPage && (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-warm-300 bg-transparent px-5 py-1.5 text-sm font-medium tracking-wide text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98]"
                >
                  Enter the Portal
                </Link>
                <form action={signOut}>
                  <button type="submit" className="rounded-lg px-3 py-1.5 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900">
                    Log out
                  </button>
                </form>
              </>
            )}
            {user && !hasActiveSub && (
              <>
                <Link
                  href="/subscribe"
                  className="cta-gradient-btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] px-5 py-1.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100"
                >
                  Join Aurora &middot; {MEMBERSHIP_PRICE}
                </Link>
                <form action={signOut}>
                  <button type="submit" className="rounded-lg px-3 py-1.5 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900">
                    Log out
                  </button>
                </form>
              </>
            )}
            {!user && (
              <>
                <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900">
                  Log in
                </Link>
                <Link href="/signup" className="rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-sm font-medium text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98]">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile bar — all auth states */}
          <div className="flex w-full items-center justify-between md:hidden">
            {showAppChrome ? (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-warm-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    user && <Avatar src={user.avatarUrl} name={user.username} email={user.email} size="sm" />
                  )}
                </button>
                <Link href="/">
                  <AuroraWordmark className="h-2.5 w-auto text-warm-600" />
                </Link>
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                    </span>
                  )}
                </Link>
              </>
            ) : isMember && isLandingPage ? (
              <>
                <Link href="/" className="group relative">
                  <AuroraWordmark className="h-4 w-auto text-warm-600" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-sm font-medium tracking-wide text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98]"
                >
                  Enter the Portal
                </Link>
              </>
            ) : user ? (
              <>
                <Link href="/" className="group relative">
                  <AuroraWordmark className="h-4 w-auto text-warm-600" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-warm-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <Avatar src={user.avatarUrl} name={user.username} email={user.email} size="sm" />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="group relative">
                  <AuroraWordmark className="h-4 w-auto text-warm-600" />
                </Link>
                <div className="flex items-center gap-2">
                  <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-warm-600">
                    Log in
                  </Link>
                  <Link href="/signup" className="rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-sm font-medium text-warm-700">
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile secondary nav — Portal / Discussions / Gather, icon-only until active */}
        {showAppChrome && (
          <div className="flex items-center gap-1 border-t border-warm-100 bg-white px-2 py-2 md:hidden">
            <Link
              href="/dashboard"
              className={`flex items-center justify-center gap-1.5 overflow-hidden rounded-full py-2 transition-all duration-300 ${isActive("/dashboard") ? "flex-[2] bg-warm-100 text-warm-900" : "flex-1 text-warm-500"}`}
            >
              <PortalIcon className="h-4 w-4 shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap text-[11px] font-medium transition-all duration-300 ${isActive("/dashboard") ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"}`}
              >
                Portal
              </span>
            </Link>
            <Link
              href="/conversations"
              className={`flex items-center justify-center gap-1.5 overflow-hidden rounded-full py-2 transition-all duration-300 ${isActive("/conversations") ? "flex-[2] bg-warm-100 text-warm-900" : "flex-1 text-warm-500"}`}
            >
              <RectangleStackIcon className="h-4 w-4 shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap text-[11px] font-medium transition-all duration-300 ${isActive("/conversations") ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"}`}
              >
                Discussions
              </span>
            </Link>
            <Link
              href="/frequency"
              className={`flex items-center justify-center gap-1.5 overflow-hidden rounded-full py-2 transition-all duration-300 ${isActive("/frequency") ? "flex-[2] bg-warm-100 text-warm-900" : "flex-1 text-warm-500"}`}
            >
              <UsersIcon className="h-4 w-4 shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap text-[11px] font-medium transition-all duration-300 ${isActive("/frequency") ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"}`}
              >
                Gather
              </span>
            </Link>
          </div>
        )}
      </nav>
      )}

      {/* Desktop permanent left sidebar — members only, not on the public landing page */}
      {showAppChrome && user && (
        <aside className="fixed inset-y-0 left-[max(0px,calc((100vw-72rem)/2))] z-40 hidden w-60 flex-col border-r border-warm-200 bg-background md:flex">
          <Link href="/" className="group relative px-6 py-5">
            <AuroraWordmark className="h-4 w-auto text-warm-600" />
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            <Link href="/dashboard" className={sidebarLinkClass(isActive("/dashboard"))}>
              <PortalIcon className="h-4 w-4" />
              Portal
            </Link>
            <Link href="/inbox" className={sidebarLinkClass(isActive("/inbox"))}>
              <ChatBubbleIcon className="h-4 w-4 text-warm-400" />
              Whisper
            </Link>
            <Link href="/frequency" className={sidebarLinkClass(isActive("/frequency"))}>
              <UsersIcon className="h-4 w-4 text-warm-400" />
              Gather
            </Link>

            <div className="my-2 border-t border-warm-100" />

            <Link href="/conversations" className={sidebarLinkClass(isActive("/conversations"))}>
              <RectangleStackIcon className="h-4 w-4 text-warm-400" />
              Discussions
            </Link>
            <Link href="/messages" className={sidebarLinkClass(isActive("/messages"))}>
              <EnvelopeIcon className="h-4 w-4 text-warm-400" />
              Private Messages
            </Link>
            <Link href="/library" className={sidebarLinkClass(isActive("/library"))}>
              <BookOpenIcon className="h-4 w-4 text-warm-400" />
              Guides
            </Link>
            <Link href="/bookmarks" className={sidebarLinkClass(isActive("/bookmarks"))}>
              <BookmarkIcon className="h-4 w-4 text-warm-400" />
              Saved
            </Link>
            <Link href="/profile" className={sidebarLinkClass(isActive("/profile"))}>
              <UserCircleIcon className="h-4 w-4 text-warm-400" />
              Profile
            </Link>

            {user.isAdmin && (
              <>
                <div className="my-2 border-t border-warm-100" />
                <p className="flex items-center gap-1 px-3 pb-0.5 pt-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-600">
                  <StarSolidIcon className="h-2.5 w-2.5" />
                  Admin
                </p>
                <Link href="/inbox" className={sidebarLinkClass(isActive("/inbox"))}>
                  Management
                </Link>
                <Link href="/admin/profiles" className={sidebarLinkClass(isActive("/admin/profiles"))}>
                  Profiles
                </Link>
                <Link href="/admin" className={sidebarLinkClass(isActive("/admin"))}>
                  Stats
                </Link>
              </>
            )}
          </nav>

          <div className="shrink-0 border-t border-warm-200 px-3 py-1">
            <Link href="/notifications" className={sidebarLinkClass(isActive("/notifications"))}>
              <BellIcon className="h-4 w-4 text-warm-400" />
              Notifications
              {unreadNotificationCount > 0 && (
                <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              )}
            </Link>
          </div>

          <div className="border-t border-warm-200 p-3">
            <Link href="/profile" className="flex items-center gap-2.5 rounded-full px-2 py-2 transition-colors hover:bg-warm-50">
              <Avatar src={user.avatarUrl} name={user.username} email={user.email} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm text-warm-700">
                {user.username || user.email}
              </span>
              {user.isAdmin && <AdminBadge />}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="mt-1 flex w-full items-center gap-2.5 rounded-full px-2 py-2 text-left text-sm font-medium text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 text-warm-400" />
                Log out
              </button>
            </form>
          </div>
        </aside>
      )}

      {/* Mobile drawer — slides in from the left */}
      {menuOpen && user && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-black/30 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-in-left fixed left-0 top-0 z-[60] h-full w-72 max-w-[80%] overflow-y-auto bg-white shadow-xl md:hidden">
            {isMember ? (
              <div className="p-5">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <Avatar src={user.avatarUrl} name={user.username} email={user.email} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-warm-900">
                      {user.username || user.email}
                    </p>
                    {user.isAdmin && <AdminBadge className="mt-1" />}
                  </div>
                </Link>
                <div className="mt-4 space-y-1 border-t border-warm-100 pt-4">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/profile") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                  >
                    <UserCircleIcon className="h-4 w-4 text-warm-400" />
                    Profile
                  </Link>
                  <Link
                    href="/messages"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/messages") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                  >
                    <EnvelopeIcon className="h-4 w-4 text-warm-400" />
                    Private Messages
                  </Link>
                  <Link
                    href="/inbox"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/inbox") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                  >
                    <ChatBubbleIcon className="h-4 w-4 text-warm-400" />
                    Whisper
                  </Link>
                  <Link
                    href="/bookmarks"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/bookmarks") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                  >
                    <BookmarkIcon className="h-4 w-4 text-warm-400" />
                    Saved
                  </Link>
                  <Link
                    href="/library"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/library") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                  >
                    <BookOpenIcon className="h-4 w-4 text-warm-400" />
                    Guides
                  </Link>
                  <InstallPrompt />
                  {user.isAdmin && (
                    <>
                      <div className="mx-3 my-1 border-t border-warm-100" />
                      <p className="flex items-center gap-1 px-3 pt-1.5 pb-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-600">
                        <StarSolidIcon className="h-2.5 w-2.5" />
                        Admin
                      </p>
                      <Link
                        href="/inbox"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                      >
                        Management
                      </Link>
                      <Link
                        href="/admin/profiles"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                      >
                        Profiles
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                      >
                        Stats
                      </Link>
                    </>
                  )}
                  <div className="mx-3 my-1 border-t border-warm-100" />
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 text-warm-400" />
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <p className="pb-3 text-sm font-medium text-warm-900">Welcome back! 👋</p>
                <div className="space-y-2">
                  <Link
                    href="/subscribe"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg bg-warm-800 px-3 py-2 text-center text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                  >
                    Join Aurora &middot; {MEMBERSHIP_PRICE}
                  </Link>
                  <form action={signOut}>
                    <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100">
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
