"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut } from "@/lib/actions/auth";
import Avatar from "@/components/avatar";
import InstallPrompt from "@/components/install-prompt";
import NotificationDropdown from "@/components/notification-dropdown";
import { MEMBERSHIP_PRICE } from "@/lib/config";

type NavUser = {
  email: string;
  username: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export default function NavInner({ user, hasActiveSub = false, unreadInboxCount = 0, unreadNotificationCount = 0 }: { user: NavUser | null; hasActiveSub?: boolean; unreadInboxCount?: number; unreadNotificationCount?: number }) {
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
          <svg className="relative h-5 w-auto text-warm-600" viewBox="0 0 455.32227 82.36768" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Aurora">
            <path d="M4.82422,19.43994c3.21484-6.23926,7.58203-11.03857,13.10352-14.40039C23.44727,1.68066,29.61426,0,36.43164,0c5.95117,0,11.16016,1.20117,15.62402,3.59961,4.46387,2.40088,8.03906,5.4248,10.72852,9.07178V1.2959h20.30371v79.77588h-20.30371v-11.66406c-2.59277,3.74414-6.16992,6.83984-10.72852,9.28809-4.56055,2.44727-9.81641,3.67188-15.76758,3.67188-6.7207,0-12.84082-1.72852-18.36035-5.18457-5.52148-3.45605-9.88867-8.32715-13.10352-14.61523C1.60645,56.28076,0,49.05615,0,40.896c0-8.06445,1.60645-15.21484,4.82422-21.45605ZM59.90332,28.5835c-1.9209-3.50293-4.5127-6.19238-7.77539-8.06348-3.26465-1.87207-6.76855-2.80859-10.51172-2.80859-3.74414,0-7.2002.91406-10.36816,2.73633-3.16797,1.82422-5.7373,4.48828-7.7041,7.99219-1.96875,3.50488-2.95215,7.65625-2.95215,12.45605,0,4.80078.9834,9,2.95215,12.59961,1.9668,3.59961,4.55859,6.36035,7.77539,8.28027,3.21582,1.9209,6.64648,2.87988,10.29688,2.87988,3.74316,0,7.24707-.93652,10.51172-2.80859,3.2627-1.87207,5.85449-4.55859,7.77539-8.06348,1.91992-3.50293,2.88086-7.7041,2.88086-12.60059,0-4.89551-.96094-9.09375-2.88086-12.59961Z"/><path d="M172.36719,1.2959v79.77588h-20.30469v-10.08008c-2.5918,3.45605-5.97559,6.16895-10.15137,8.13574s-8.71191,2.95215-13.6084,2.95215c-6.24121,0-11.76074-1.31836-16.55957-3.95996-4.80176-2.63965-8.56836-6.52734-11.30469-11.66406-2.73535-5.13477-4.10352-11.25488-4.10352-18.36035V1.2959h20.16016v43.91943c0,6.33594,1.58398,11.20996,4.75195,14.61621,3.16797,3.40918,7.48828,5.1123,12.95996,5.1123,5.56641,0,9.93555-1.70312,13.10352-5.1123,3.16797-3.40625,4.75195-8.28027,4.75195-14.61621V1.2959h20.30469Z"/><path d="M216.79004,3.74365c4.17578-2.39844,8.95117-3.6001,14.32812-3.6001v21.16846h-5.32812c-6.33594,0-11.1123,1.48926-14.32812,4.46387-3.2168,2.97656-4.82324,8.16016-4.82324,15.55176v39.74414h-20.16016V1.2959h20.16016v12.3833c2.5918-4.22266,5.97559-7.53467,10.15137-9.93555Z"/><path d="M253.58105,77.25537c-6.14453-3.40625-10.96875-8.23047-14.47168-14.47168-3.50586-6.23926-5.25586-13.43945-5.25586-21.60059,0-8.1582,1.7998-15.3584,5.39941-21.59961,3.60059-6.23926,8.51855-11.06299,14.76074-14.47168,6.23926-3.40674,13.19824-5.11182,20.87988-5.11182,7.67871,0,14.63867,1.70508,20.87988,5.11182,6.23926,3.40869,11.16016,8.23242,14.75977,14.47168,3.59961,6.24121,5.40039,13.44141,5.40039,21.59961,0,8.16113-1.84961,15.36133-5.54395,21.60059-3.69727,6.24121-8.68945,11.06543-14.97656,14.47168-6.28809,3.40918-13.31934,5.1123-21.0957,5.1123-7.68164,0-14.59375-1.70312-20.73633-5.1123ZM284.61328,62.13525c3.21484-1.77539,5.78223-4.43945,7.7041-7.99219,1.91895-3.5498,2.87988-7.87012,2.87988-12.95996,0-7.58203-1.99316-13.41406-5.97559-17.49512-3.98535-4.08008-8.85645-6.12012-14.61621-6.12012s-10.58398,2.04004-14.47266,6.12012c-3.8877,4.08105-5.83105,9.91309-5.83105,17.49512,0,7.58496,1.89355,13.41699,5.6875,17.49609,3.79102,4.08203,8.56836,6.12012,14.32812,6.12012,3.64746,0,7.07812-.88672,10.2959-2.66406Z"/><path d="M355.31543,3.74365c4.17578-2.39844,8.9502-3.6001,14.32812-3.6001v21.16846h-5.32812c-6.33594,0-11.11328,1.48926-14.32812,4.46387-3.21777,2.97656-4.82422,8.16016-4.82422,15.55176v39.74414h-20.16016V1.2959h20.16016v12.3833c2.5918-4.22266,5.97559-7.53467,10.15234-9.93555Z"/><path d="M377.05859,19.43994c3.21484-6.23926,7.58203-11.03857,13.10352-14.40039,5.51953-3.35889,11.68652-5.03955,18.50391-5.03955,5.95117,0,11.16016,1.20117,15.62402,3.59961,4.46387,2.40088,8.03906,5.4248,10.72852,9.07178V1.2959h20.30371v79.77588h-20.30371v-11.66406c-2.5918,3.74414-6.16992,6.83984-10.72852,9.28809-4.56055,2.44727-9.81641,3.67188-15.76758,3.67188-6.7207,0-12.84082-1.72852-18.36035-5.18457-5.52148-3.45605-9.88867-8.32715-13.10352-14.61523-3.21777-6.28711-4.82422-13.51172-4.82422-21.67188,0-8.06445,1.60645-15.21484,4.82422-21.45605ZM432.1377,28.5835c-1.9209-3.50293-4.5127-6.19238-7.77539-8.06348-3.26465-1.87207-6.76855-2.80859-10.51172-2.80859-3.74414,0-7.2002.91406-10.36816,2.73633-3.16797,1.82422-5.7373,4.48828-7.7041,7.99219-1.96875,3.50488-2.95215,7.65625-2.95215,12.45605,0,4.80078.9834,9,2.95215,12.59961,1.9668,3.59961,4.55859,6.36035,7.77539,8.28027,3.21582,1.9209,6.64648,2.87988,10.29688,2.87988,3.74316,0,7.24707-.93652,10.51172-2.80859,3.2627-1.87207,5.85449-4.55859,7.77539-8.06348,1.91992-3.50293,2.88086-7.7041,2.88086-12.60059,0-4.89551-.96094-9.09375-2.88086-12.59961Z"/>
          </svg>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          {user && !hasActiveSub && (
            <>
              <Link
                href="/subscribe"
                className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-5 py-1.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] active:scale-[0.97]"
              >
                Join The Aurora Circle — {MEMBERSHIP_PRICE}
              </Link>
              <form action={signOut}>
                <button type="submit" className="rounded-full px-3 py-1.5 text-sm font-medium text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900">
                  Log out
                </button>
              </form>
            </>
          )}
          {(hasActiveSub && user) ? (
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
          ) : !user ? (
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
          ) : null}
        </div>

        {/* Mobile: avatar + bell + burger */}
        <div className="flex items-center gap-1 md:hidden">
          {hasActiveSub && <NotificationDropdown unreadCount={unreadNotificationCount} />}
          {user && (
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full p-0.5 transition-opacity hover:opacity-80"
              aria-label="Toggle menu"
            >
              <Avatar src={user.avatarUrl} name={user.username} email={user.email} size="sm" />
            </button>
          )}
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
          {(hasActiveSub && user) ? (
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
          ) : user ? (
            <div className="space-y-2">
              <p className="px-1 pb-1 text-sm font-medium text-warm-900">Welcome back! 👋</p>
              <Link
                href="/subscribe"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-warm-800 px-3 py-2 text-center text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
              >
                Join The Aurora Circle — {MEMBERSHIP_PRICE}
              </Link>
              <form action={signOut}>
                <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100">
                  Log out
                </button>
              </form>
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
