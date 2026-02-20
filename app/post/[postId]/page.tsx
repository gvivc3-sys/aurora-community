import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import ArticleBody from "@/app/dashboard/article-body";
import PostActions from "@/app/dashboard/post-actions";
import AudioPlayer from "@/components/audio-player";

export const dynamic = "force-dynamic";

const tagStyles: Record<string, { badge: string; emoji: string }> = {
  love: { badge: "bg-pink-50 text-pink-700", emoji: "\u2764\uFE0F" },
  health: { badge: "bg-green-50 text-green-700", emoji: "\uD83C\uDF3F" },
  magic: { badge: "bg-purple-50 text-purple-700", emoji: "\u2728" },
  ask: { badge: "bg-amber-50 text-amber-700", emoji: "\uD83E\uDD0D" },
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

type Params = Promise<{ postId: string }>;

export default async function PostPage({ params }: { params: Params }) {
  const { postId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the single post
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch likes
  const { data: likes } = await supabase
    .from("likes")
    .select("post_id, user_id")
    .eq("post_id", postId);

  const likeCount = likes?.length ?? 0;
  const likedByUser = likes?.some((l) => l.user_id === user.id) ?? false;

  // Fetch comments
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  // Fetch bookmark status
  const { data: bookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Fetch handles for comment authors
  const commentUserIds = [
    ...new Set((comments ?? []).map((c) => c.user_id)),
  ];
  const { data: handleRows } = commentUserIds.length
    ? await supabaseAdmin
        .from("user_handles")
        .select("user_id, handle")
        .in("user_id", commentUserIds)
    : { data: [] };
  const userHandles: Record<string, string> = {};
  for (const row of handleRows ?? []) {
    userHandles[row.user_id] = row.handle;
  }

  const admin = isAdmin(user);
  const video =
    post.type === "video" && post.video_url
      ? extractVideoId(post.video_url)
      : null;
  const tag = tagStyles[post.tag];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 transition-colors hover:text-warm-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Circle
        </Link>

        {/* Post card */}
        <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.author_id}`}>
                <Avatar
                  src={post.author_avatar_url}
                  name={post.author_name}
                  size="sm"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/profile/${post.author_id}`}
                  className="truncate text-sm font-medium text-warm-900 hover:underline"
                >
                  {post.author_name ?? "Unknown"}
                </Link>
                <p className="text-xs text-warm-400">
                  {timeAgo(post.created_at)}
                </p>
              </div>
            </div>
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tag?.badge ?? "bg-warm-100 text-warm-600"}`}
            >
              <span>{tag?.emoji}</span>
              {post.tag === "ask" ? "whisper" : post.tag}
            </span>
          </div>

          {/* Video */}
          {post.type === "video" && video && (
            <>
              <div className="mt-3 aspect-video">
                <iframe
                  src={getEmbedUrl(video.provider, video.id)}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {post.body && (
                <div
                  className="prose prose-sm prose-zinc mt-3 max-w-none px-4"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              )}
            </>
          )}

          {/* Anonymous question */}
          {post.anonymous_question && (
            <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
              <p className="text-xs font-medium text-warm-500">
                A sister whispered:
              </p>
              <p className="mt-1 text-sm italic text-warm-600">
                {post.anonymous_question}
              </p>
            </div>
          )}

          {/* Text */}
          {post.type === "text" && post.body && (
            <div
              className="prose prose-sm prose-zinc mt-3 max-w-none px-4"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}

          {/* Article */}
          {post.type === "article" && post.body && (
            <ArticleBody title={post.title} body={post.body} />
          )}

          {/* Voice */}
          {post.type === "voice" && (
            <div className="mt-3 px-4">
              {post.title && (
                <h3 className="mb-2 text-base font-medium text-warm-900">
                  {post.title}
                </h3>
              )}
              {post.audio_url && <AudioPlayer src={post.audio_url} />}
              {post.body && (
                <p className="mt-2 text-sm leading-relaxed text-warm-600">
                  {post.body}
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="mx-4 mt-3 border-t border-warm-100" />

          {/* Actions + comments */}
          <PostActions
            postId={post.id}
            likeCount={likeCount}
            likedByUser={likedByUser}
            bookmarkedByUser={!!bookmark}
            comments={comments ?? []}
            commentCount={comments?.length ?? 0}
            commentsEnabled={post.comments_enabled}
            currentUserId={user.id}
            isAdmin={admin}
            userHandles={userHandles}
            defaultCommentsOpen
            hideFocusLink
          />
        </div>
      </div>
    </div>
  );
}
