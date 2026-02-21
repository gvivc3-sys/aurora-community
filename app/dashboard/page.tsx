import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import PostForm from "./post-form";
import ArticleBody from "./article-body";
import FeedFilters from "./feed-filters";
import PostActions from "./post-actions";
import AudioPlayer from "@/components/audio-player";
import RealtimeRefresh from "@/components/realtime-refresh";
import ScrollToTop from "./scroll-to-top";
import WelcomeCard from "./welcome-card";
import TimeAgo from "@/components/time-ago";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const tagStyles: Record<string, { badge: string; emoji: string }> = {
  love: { badge: "bg-pink-50 text-pink-700", emoji: "\u2764\uFE0F" },
  health: { badge: "bg-green-50 text-green-700", emoji: "\uD83C\uDF3F" },
  magic: { badge: "bg-fuchsia-50 text-fuchsia-700", emoji: "\u2728" },
  ask: { badge: "bg-amber-50 text-amber-700", emoji: "\uD83E\uDD0D" },
};

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
    ["love", "health", "magic", "ask"].includes(params.tag)
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
    query = query.eq("tag", tagFilter as "love" | "health" | "magic" | "ask");
  }
  if (typeFilter) {
    query = query.eq("type", typeFilter as "video" | "text" | "article" | "voice");
  }
  query = query
    .order("pinned", { ascending: false, nullsFirst: false })
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

  // Fetch handles for post authors and comment authors
  const allUserIds = [
    ...new Set([
      ...(posts ?? []).map((p) => p.author_id),
      ...(allComments ?? []).map((c) => c.user_id),
    ]),
  ];
  const { data: handleRows } = allUserIds.length
    ? await supabaseAdmin
        .from("user_handles")
        .select("user_id, handle")
        .in("user_id", allUserIds)
    : { data: [] };
  const userHandles: Record<string, string> = {};
  for (const row of handleRows ?? []) {
    userHandles[row.user_id] = row.handle;
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
      <ScrollToTop />
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
                  id={`post-${post.id}`}
                  className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm transition-shadow hover:shadow-md scroll-mt-16"
                >
                  {/* Header: author info + tag */}
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
                        <div className="flex items-center gap-1.5">
                          <Link href={`/profile/${post.author_id}`} className="shrink-0 truncate text-sm font-medium text-warm-900 hover:underline">
                            {post.author_name ?? "Unknown"}
                          </Link>
                          {userHandles[post.author_id] && (
                            <Link href={`/profile/${post.author_id}`} className="shrink-0 text-xs font-medium text-warm-500 hover:underline">
                              @{userHandles[post.author_id]}
                            </Link>
                          )}
                          <span className="shrink-0 text-warm-300">&middot;</span>
                          <TimeAgo date={post.created_at} className="shrink-0 text-xs text-warm-400" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!!post.pinned && (
                        <span className="flex items-center gap-1 rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">
                          📌 Pinned
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tag?.badge ?? "bg-warm-100 text-warm-600"}`}
                      >
                        <span>{tag?.emoji}</span>
                        {post.tag === "ask" ? "whisper" : post.tag}
                      </span>
                    </div>
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

                  {/* Anonymous question quote */}
                  {post.anonymous_question && (
                    <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                      <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                      <p className="mt-1 text-sm italic text-warm-600">
                        {post.anonymous_question}
                      </p>
                    </div>
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
                    likeCount={likeCounts[post.id] ?? 0}
                    likedByUser={!!userLiked[post.id]}
                    bookmarkedByUser={!!userBookmarked[post.id]}
                    comments={commentsByPost[post.id] ?? []}
                    commentCount={commentCounts[post.id] ?? 0}
                    commentsEnabled={post.comments_enabled}
                    currentUserId={user.id}
                    isAdmin={admin}
                    userHandles={userHandles}
                    pinned={!!post.pinned}
                  />
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">The portal is quiet for now.</p>
              <p className="mt-2 text-sm text-warm-400">
                {tagFilter || typeFilter
                  ? "Try adjusting your filters to see more posts."
                  : "New posts will appear here as the community grows."}
              </p>
            </div>
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
