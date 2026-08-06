"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getNotifications, clearAllNotifications, markAllNotificationsRead } from "@/lib/actions/notifications";

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
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
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
    case "direct_message":
      return "sent you a message";
    case "mention_thread":
      return "mentioned you in a discussion";
    case "mention_thread_reply":
      return "mentioned you in a reply";
    default:
      return "mentioned you";
  }
}

function getNavigationHref(notification: Notification): string {
  if (notification.resource_type === "conversation" && notification.resource_id) {
    return `/messages/${notification.resource_id}`;
  }
  if (notification.resource_type === "message") {
    return "/inbox";
  }
  if (notification.resource_type === "thread" && notification.resource_id) {
    return `/conversations/${notification.resource_id}`;
  }
  if (notification.resource_id) {
    return `/post/${notification.resource_id}`;
  }
  return "/dashboard";
}

export default function NotificationsList() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getNotifications(50);
      setNotifications(data as Notification[]);
      setLoading(false);
      await markAllNotificationsRead();
      router.refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClearAll() {
    await clearAllNotifications();
    setNotifications([]);
    router.refresh();
  }

  if (loading) {
    return <div className="py-6 text-center text-sm text-warm-400">Loading...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-warm-200 bg-white py-12 text-center shadow-sm">
        <p className="text-sm text-warm-400">No notifications yet</p>
        <p className="mt-1 text-xs text-warm-300">
          You&apos;ll be notified when someone mentions you.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-warm-100 px-4 py-3">
        <p className="text-sm text-warm-500">{notifications.length} total</p>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs font-medium text-warm-500 hover:text-warm-700"
        >
          Clear all
        </button>
      </div>

      <div>
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={getNavigationHref(notification)}
            className={`flex gap-3 border-b border-warm-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-warm-50 ${
              !notification.read ? "bg-warm-50/60" : ""
            }`}
          >
            {notification.actor_avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
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
        ))}
      </div>
    </div>
  );
}
