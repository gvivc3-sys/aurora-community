"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "@/lib/actions/auth";
import Avatar from "@/components/avatar";
import InstallPrompt from "@/components/install-prompt";
import NotificationDropdown from "@/components/notification-dropdown";

type NavUser = {
  email: string;
  username: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export default function NavInner({ user, unreadInboxCount = 0, unreadNotificationCount = 0 }: { user: NavUser | null; unreadInboxCount?: number; unreadNotificationCount?: number }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-warm-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Aurora logo with gaussian blur accent */}
        <Link
          href="/"
          className="group relative"
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-200/40 to-amber-200/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative font-display text-xl font-bold italic tracking-tight text-warm-900">
            Aurora
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-warm-50 hover:text-warm-900 ${isActive("/dashboard") ? "bg-warm-50 text-warm-900" : "text-warm-600"}`}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 animate-[spin_12s_linear_infinite]" fill="none">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <circle
                      key={angle}
                      cx={10 + 7 * Math.cos((angle * Math.PI) / 180)}
                      cy={10 + 7 * Math.sin((angle * Math.PI) / 180)}
                      r={angle % 90 === 0 ? 1.4 : 1}
                      fill="currentColor"
                      opacity={0.3 + (angle / 315) * 0.7}
                    />
                  ))}
                </svg>
                Circle
              </Link>

              <Link
                href="/inbox"
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-warm-50 hover:text-warm-900 ${isActive("/inbox") ? "bg-warm-50 text-warm-900" : "text-warm-600"}`}
              >
                Whisper
              </Link>

              {/* More dropdown (hover) */}
              <div
                ref={dropdownRef}
                className="group/dropdown relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                >
                  More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-0 w-48 overflow-hidden rounded-xl border border-warm-200 bg-white/95 pt-2 pb-1 shadow-lg backdrop-blur-sm">
                    <Link
                      href="/chat"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                    >
                      Telegram
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                    >
                      Saved
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                    >
                      Profile
                    </Link>
                    {user.isAdmin && (
                      <>
                        <div className="mx-3 my-1 border-t border-warm-100" />
                        <p className="px-4 pt-1.5 pb-0.5 font-mono text-[10px] uppercase tracking-widest text-warm-400">Admin</p>
                        <Link
                          href="/inbox"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                        >
                          Inbox
                          {unreadInboxCount > 0 && (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                              {unreadInboxCount > 9 ? "9+" : unreadInboxCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/admin/profiles"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                        >
                          Profiles
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                        >
                          Stats
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <NotificationDropdown unreadCount={unreadNotificationCount} />

              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors hover:bg-warm-50 hover:text-warm-900"
              >
                <Avatar
                  src={user.avatarUrl}
                  name={user.username}
                  email={user.email}
                  size="sm"
                />
                <span className="text-sm text-warm-700">
                  {user.username || user.email}
                </span>
                {user.isAdmin && (
                  <span className="rounded-full bg-warm-900 px-2 py-0.5 text-xs font-medium text-warm-50">
                    Admin
                  </span>
                )}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-4 py-1.5 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: bell + burger */}
        <div className="flex items-center gap-1 md:hidden">
          {user && <NotificationDropdown unreadCount={unreadNotificationCount} />}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-warm-600 transition-colors hover:bg-warm-100"
            aria-label="Toggle menu"
          >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-warm-100 bg-white px-6 pb-4 pt-3 md:hidden">
          {user ? (
            <div className="space-y-3">
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Avatar
                  src={user.avatarUrl}
                  name={user.username}
                  email={user.email}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-warm-900">
                    {user.username || user.email}
                  </p>
                  {user.isAdmin && (
                    <span className="text-xs text-warm-500">Admin</span>
                  )}
                </div>
              </Link>
              <div className="border-t border-warm-100 pt-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/dashboard") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4 animate-[spin_12s_linear_infinite]" fill="none">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <circle
                        key={angle}
                        cx={10 + 7 * Math.cos((angle * Math.PI) / 180)}
                        cy={10 + 7 * Math.sin((angle * Math.PI) / 180)}
                        r={angle % 90 === 0 ? 1.4 : 1}
                        fill="currentColor"
                        opacity={0.3 + (angle / 315) * 0.7}
                      />
                    ))}
                  </svg>
                  Circle
                </Link>
                <Link
                  href="/inbox"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/inbox") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  Whisper
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/chat") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  Telegram
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/bookmarks") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  Saved
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/profile") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  Profile
                </Link>
                <InstallPrompt />
                {user.isAdmin && (
                  <>
                    <div className="mx-3 my-1 border-t border-warm-100" />
                    <p className="px-3 pt-1.5 pb-0.5 font-mono text-[10px] uppercase tracking-widest text-warm-400">Admin</p>
                    <Link
                      href="/inbox"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                    >
                      Inbox
                      {unreadInboxCount > 0 && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {unreadInboxCount > 9 ? "9+" : unreadInboxCount}
                        </span>
                      )}
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
                <form action={signOut}>
                  <button
                    type="submit"
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-3 py-2 text-center text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
