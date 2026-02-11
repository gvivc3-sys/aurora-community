"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import Avatar from "@/components/avatar";

type NavUser = {
  email: string;
  username: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export default function NavInner({ user, unreadInboxCount = 0 }: { user: NavUser | null; unreadInboxCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-warm-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-light tracking-tight text-warm-900"
        >
          Aurora
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-warm-600 transition-colors hover:text-warm-900"
              >
                Feed
              </Link>
              <Link
                href="/chat"
                className="text-sm font-medium text-warm-600 transition-colors hover:text-warm-900"
              >
                Chat
              </Link>
              <Link
                href="/bookmarks"
                className="text-sm font-medium text-warm-600 transition-colors hover:text-warm-900"
              >
                Saved
              </Link>
              <Link
                href="/inbox"
                className="relative text-sm font-medium text-warm-600 transition-colors hover:text-warm-900"
              >
                Inbox
                {unreadInboxCount > 0 && (
                  <span className="absolute -right-3 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadInboxCount > 9 ? "9+" : unreadInboxCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors hover:bg-warm-100"
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
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-800"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-900"
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

        {/* Burger button (mobile) */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-warm-600 transition-colors hover:bg-warm-100 md:hidden"
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
                  className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                >
                  Feed
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                >
                  Chat
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                >
                  Saved
                </Link>
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
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
                >
                  Profile
                </Link>
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
