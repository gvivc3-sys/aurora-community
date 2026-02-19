import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getZodiacSign } from "@/lib/zodiac";
import Avatar from "@/components/avatar";

const tagStyles: Record<string, { badge: string; emoji: string }> = {
  love: { badge: "bg-pink-50 text-pink-700", emoji: "\u2764\uFE0F" },
  health: { badge: "bg-green-50 text-green-700", emoji: "\uD83C\uDF3F" },
  magic: { badge: "bg-purple-50 text-purple-700", emoji: "\u2728" },
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

type Params = Promise<{ userId: string }>;

export default async function PublicProfilePage({
  params,
}: {
  params: Params;
}) {
  const { userId } = await params;

  const supabase = await createClient();
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  if (!viewer) {
    redirect("/login");
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data?.user) {
    notFound();
  }

  const target = data.user;
  const meta = target.user_metadata ?? {};
  const isOwner = viewer.id === target.id;

  // Fetch target user's bookmarks (admin client bypasses RLS so any viewer can see them)
  const { data: bookmarks } = await supabaseAdmin
    .from("bookmarks")
    .select("post_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const postIds = bookmarks?.map((b) => b.post_id) ?? [];

  const { data: posts } = postIds.length
    ? await supabaseAdmin.from("posts").select("*").in("id", postIds)
    : { data: [] };

  const postMap = new Map((posts ?? []).map((p) => [p.id, p]));
  const savedPosts = postIds
    .map((id) => postMap.get(id))
    .filter(Boolean) as NonNullable<typeof posts>;

  const memberSince = new Date(target.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const zodiac = meta.birthday
    ? getZodiacSign(new Date(meta.birthday))
    : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Avatar + name + member since */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={meta.avatar_url}
            name={meta.username}
            email={target.email}
            size="lg"
          />
          <h1 className="mt-4 text-2xl font-light tracking-tight text-warm-900">
            {meta.username ?? "Anonymous"}
          </h1>
          <p className="mt-1 text-sm text-warm-400">
            Member since {memberSince}
          </p>
        </div>

        {/* Zodiac badge */}
        {zodiac && (
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-warm-100 px-4 py-2 text-sm text-warm-700">
              <span className="text-lg">{zodiac.symbol}</span>{" "}
              <strong>{zodiac.name}</strong> — {zodiac.element} sign
            </div>
          </div>
        )}

        {/* Bio */}
        {meta.bio && (
          <div className="mt-6 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-warm-700">
              {meta.bio}
            </p>
          </div>
        )}

        {/* Telegram */}
        {meta.telegram_handle && (
          <div className="mt-4 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Telegram</h2>
            <a
              href={`https://t.me/${meta.telegram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-warm-700 underline hover:text-warm-900"
            >
              @{meta.telegram_handle}
            </a>
          </div>
        )}

        {/* Saved posts */}
        {savedPosts.length > 0 && (
          <div className="mt-6 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Saved</h2>
            <div className="mt-3 space-y-3">
              {savedPosts.map((post) => {
                const tag = tagStyles[post.tag];
                const label =
                  post.type === "article" || post.type === "voice"
                    ? post.title || "Untitled"
                    : (post.body ?? "").replace(/<[^>]*>/g, "").slice(0, 80) +
                      ((post.body ?? "").replace(/<[^>]*>/g, "").length > 80
                        ? "…"
                        : "");
                return (
                  <Link
                    key={post.id}
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-warm-50"
                  >
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tag?.badge ?? "bg-warm-100 text-warm-600"}`}
                    >
                      <span>{tag?.emoji}</span>
                      {post.tag}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-warm-700">
                      {label}
                    </span>
                    <span className="shrink-0 text-xs text-warm-400">
                      {timeAgo(post.created_at)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Owner hint */}
        {isOwner && (
          <div className="mt-6 rounded-2xl border border-warm-200 bg-warm-100 px-4 py-3 text-center">
            <p className="text-sm text-warm-600">
              This is your profile.{" "}
              <Link
                href="/profile"
                className="font-medium underline hover:text-warm-900"
              >
                Edit it here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
