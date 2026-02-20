"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getNotifications, clearAllNotifications } from "@/lib/actions/notifications";

type Notification = {
  id: string;
  user_id: string;
  type: string;
  actor_id: string;
  actor_name: string | null;
  actor_avatar_url: string | null;
  resource_type: string | null;
  resource_id: string | null;
  body_preview: string | null;
  read: boolean;
  created_at: string;
};

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "mention_post":
      return "mentioned you in a post";
    case "mention_comment":
      return "mentioned you in a comment";
    case "mention_reply":
      return "mentioned you in a reply";
    default:
      return "mentioned you";
  }
}

function getNavigationHref(notification: Notification): string {
  if (notification.resource_type === "message") {
    return "/inbox";
  }
  if (notification.resource_id) {
    return `/dashboard#post-${notification.resource_id}`;
  }
  return "/dashboard";
}

export default function NotificationDropdown({
  unreadCount,
}: {
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [localUnread, setLocalUnread] = useState(unreadCount);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalUnread(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    setOpen(!open);
    if (!open) {
      setLoading(true);
      const data = await getNotifications(20);
      setNotifications(data as Notification[]);
      setLoading(false);
    }
  }

  async function handleClearAll() {
    await clearAllNotifications();
    setNotifications([]);
    setLocalUnread(0);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="relative flex items-center rounded-full p-1.5 text-warm-600 transition-colors hover:bg-warm-50 hover:text-warm-900"
        aria-label="Notifications"
      >
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
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {localUnread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {localUnread > 9 ? "9+" : localUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-warm-200 bg-white/95 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-warm-100 px-4 py-3">
            <h3 className="text-sm font-medium text-warm-900">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-warm-500 hover:text-warm-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-warm-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-warm-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNavigationHref(notification)}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 transition-colors hover:bg-warm-50 ${
                    !notification.read ? "bg-warm-50/60" : ""
                  }`}
                >
                  {notification.actor_avatar_url ? (
                    <img
                      src={notification.actor_avatar_url}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-200 text-xs font-medium text-warm-600">
                      {(notification.actor_name || "?")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-warm-700">
                      <span className="font-medium text-warm-900">
                        {notification.actor_name || "Someone"}
                      </span>{" "}
                      {getTypeLabel(notification.type)}
                    </p>
                    {notification.body_preview && (
                      <p className="mt-0.5 truncate text-xs text-warm-400">
                        {notification.body_preview}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-warm-400">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
