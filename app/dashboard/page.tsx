import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import PostForm from "./post-form";
import ArticleBody from "./article-body";
import FeedFilters from "./feed-filters";
import PostActions from "./post-actions";
import AudioPlayer from "@/components/audio-player";
import RealtimeRefresh from "@/components/realtime-refresh";
import WelcomeCard from "./welcome-card";

const PAGE_SIZE = 20;

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

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Parse query params
  const tagFilter =
    typeof params.tag === "string" &&
    ["love", "health", "magic"].includes(params.tag)
      ? params.tag
      : null;
  const typeFilter =
    typeof params.type === "string" &&
    ["video", "text", "article", "voice"].includes(params.type)
      ? params.type
      : null;
  const sort =
    typeof params.sort === "string" && params.sort === "oldest"
      ? "oldest"
      : "newest";
  const page = Math.max(
    1,
    typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1,
  );

  // Build query
  let query = supabase.from("posts").select("*", { count: "exact" });
  if (tagFilter) {
    query = query.eq("tag", tagFilter as "love" | "health" | "magic");
  }
  if (typeFilter) {
    query = query.eq("type", typeFilter as "video" | "text" | "article" | "voice");
  }
  query = query
    .order("created_at", { ascending: sort === "oldest" })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data: posts, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  const postIds = posts?.map((p) => p.id) ?? [];

  // Fetch all likes for these posts in one query
  const { data: allLikes } = postIds.length
    ? await supabase
        .from("likes")
        .select("post_id, user_id")
        .in("post_id", postIds)
    : { data: [] };

  // Fetch all comments for these posts
  const { data: allComments } = postIds.length
    ? await supabase
        .from("comments")
        .select("*")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  // Fetch user's bookmarks for these posts
  const { data: allBookmarks } = postIds.length
    ? await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds)
    : { data: [] };
  const userBookmarked: Record<string, boolean> = {};
  for (const bm of allBookmarks ?? []) {
    userBookmarked[bm.post_id] = true;
  }

  // Compute like counts and user-liked per post
  const likeCounts: Record<string, number> = {};
  const userLiked: Record<string, boolean> = {};
  for (const like of allLikes ?? []) {
    likeCounts[like.post_id] = (likeCounts[like.post_id] ?? 0) + 1;
    if (like.user_id === user.id) {
      userLiked[like.post_id] = true;
    }
  }

  // Group comments by post
  type Comment = NonNullable<typeof allComments>[number];
  const commentsByPost: Record<string, Comment[]> = {};
  const commentCounts: Record<string, number> = {};
  for (const comment of allComments ?? []) {
    if (!commentsByPost[comment.post_id]) {
      commentsByPost[comment.post_id] = [];
    }
    commentsByPost[comment.post_id].push(comment);
    commentCounts[comment.post_id] =
      (commentCounts[comment.post_id] ?? 0) + 1;
  }

  const admin = isAdmin(user);

  // Build pagination URLs
  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (tagFilter) sp.set("tag", tagFilter);
    if (sort === "oldest") sp.set("sort", "oldest");
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/dashboard${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <RealtimeRefresh table="posts" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-center font-mono text-sm text-warm-500">
          welcome {user.user_metadata?.username || user.email}
        </p>

        <div className="mt-4">
          <WelcomeCard />
        </div>

        {!user.user_metadata?.username && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
            <p className="text-sm text-amber-800">
              You haven&apos;t set a display name yet.{" "}
              <a
                href="/profile"
                className="font-medium underline hover:text-amber-900"
              >
                Set up your profile
              </a>
            </p>
          </div>
        )}

        {admin && (
          <div className="mt-8">
            <PostForm />
          </div>
        )}

        <div className="mt-8">
          <FeedFilters />
        </div>

        <div className="mt-6 space-y-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              const video =
                post.type === "video" && post.video_url
                  ? extractVideoId(post.video_url)
                  : null;

              const tag = tagStyles[post.tag];

              return (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Header: author info + tag */}
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={post.author_avatar_url}
                        name={post.author_name}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-warm-900">
                          {post.author_name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-warm-400">
                          {timeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tag?.badge ?? "bg-warm-100 text-warm-600"}`}
                    >
                      <span>{tag?.emoji}</span>
                      {post.tag}
                    </span>
                  </div>

                  {/* Video embed + optional description */}
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

                  {/* Text post body */}
                  {post.type === "text" && post.body && (
                    <div
                      className="prose prose-sm prose-zinc mt-3 max-w-none px-4"
                      dangerouslySetInnerHTML={{ __html: post.body }}
                    />
                  )}

                  {/* Article post body (collapsible) */}
                  {post.type === "article" && post.body && (
                    <ArticleBody title={post.title} body={post.body} />
                  )}

                  {/* Voice post */}
                  {post.type === "voice" && (
                    <div className="mt-3 px-4">
                      {post.title && (
                        <h3 className="mb-2 text-base font-medium text-warm-900">
                          {post.title}
                        </h3>
                      )}
                      {post.audio_url && (
                        <AudioPlayer src={post.audio_url} />
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="mx-4 mt-3 border-t border-warm-100" />

                  {/* Actions + comments */}
                  <PostActions
                    postId={post.id}
                    likeCount={likeCounts[post.id] ?? 0}
                    likedByUser={!!userLiked[post.id]}
                    bookmarkedByUser={!!userBookmarked[post.id]}
                    comments={commentsByPost[post.id] ?? []}
                    commentCount={commentCounts[post.id] ?? 0}
                    commentsEnabled={post.comments_enabled}
                    currentUserId={user.id}
                    isAdmin={admin}
                  />
                </div>
              );
            })
          ) : (
            <p className="py-12 text-center text-warm-400">No posts yet.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="rounded-full bg-warm-100 px-4 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-200"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-warm-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="rounded-full bg-warm-100 px-4 py-1.5 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-200"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
