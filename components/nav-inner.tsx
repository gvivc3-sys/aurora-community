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

  // ESC to close mobile menu
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-warm-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Aurora logo with gaussian blur accent */}
        <Link
          href="/"
          className="group relative"
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-fuchsia-200/40 to-pink-200/40 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
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
                <svg viewBox="0 0 258.22298 283.80057" className="h-4 w-auto animate-[spin_12s_linear_infinite]" fill="#9b3aed">
                  <path d="M257.08826,179.18199C219.48497,356.1381-28.9813,290.03619,2.80007,119.20064,14.26282,59.83959,64.89421,10.28182,124.54861.83252c10.6214-3.27536,22.24991,3.39539,22.19956,15.06622.00015,7.96598-5.90928,14.66283-13.80183,15.74607C-10.41877,53.49283,4.63344,270.06294,153.71203,250.64353c20.35698-4.20945,39.73611-16.08843,52.58595-32.042,38.87844-45.24125,17.97503-120.58777-42.38191-132.06891-20.73292-3.84051-44.23146,2.20129-58.85747,17.78997-26.92879,24.57781-23.98987,73.02894,10.01097,88.71939,50.9672,24.12123,80.02278-50.14195,32.55867-53.27997,5.79414,2.69217,9.7573,6.7851,10.93981,13.80016,4.07004,26.86157-34.76871,31.24146-45.8793,9.81855-20.54661-49.95095,49.5218-75.95895,79.41831-34.16748,18.30267,23.93839,13.12901,59.35308-8.31931,80.05857-54.34739,53.05058-143.55428-6.73916-127.32727-78.94152C90.85654-.7589,274.28501,50.91175,257.08826,179.18199Z"/>
                </svg>
                Portal
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
                      href="/library"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                    >
                      Ashley&apos;s Library
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
                          href="/management"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
                        >
                          Management
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
                className="rounded-full bg-warm-800 px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
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
        <div className="animate-slide-down border-t border-warm-100 bg-white px-6 pb-4 pt-3 md:hidden">
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
                  <svg viewBox="0 0 258.22298 283.80057" className="h-4 w-auto animate-[spin_12s_linear_infinite]" fill="#9b3aed">
                    <path d="M257.08826,179.18199C219.48497,356.1381-28.9813,290.03619,2.80007,119.20064,14.26282,59.83959,64.89421,10.28182,124.54861.83252c10.6214-3.27536,22.24991,3.39539,22.19956,15.06622.00015,7.96598-5.90928,14.66283-13.80183,15.74607C-10.41877,53.49283,4.63344,270.06294,153.71203,250.64353c20.35698-4.20945,39.73611-16.08843,52.58595-32.042,38.87844-45.24125,17.97503-120.58777-42.38191-132.06891-20.73292-3.84051-44.23146,2.20129-58.85747,17.78997-26.92879,24.57781-23.98987,73.02894,10.01097,88.71939,50.9672,24.12123,80.02278-50.14195,32.55867-53.27997,5.79414,2.69217,9.7573,6.7851,10.93981,13.80016,4.07004,26.86157-34.76871,31.24146-45.8793,9.81855-20.54661-49.95095,49.5218-75.95895,79.41831-34.16748,18.30267,23.93839,13.12901,59.35308-8.31931,80.05857-54.34739,53.05058-143.55428-6.73916-127.32727-78.94152C90.85654-.7589,274.28501,50.91175,257.08826,179.18199Z"/>
                  </svg>
                  Portal
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
                  href="/library"
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-warm-100 ${isActive("/library") ? "bg-warm-100 text-warm-900" : "text-warm-600"}`}
                >
                  Ashley&apos;s Library
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
                      href="/management"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                    >
                      Management
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
                className="block rounded-full bg-warm-800 px-3 py-2 text-center text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
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
