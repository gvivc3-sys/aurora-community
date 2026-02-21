import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import ArticleBody from "@/app/dashboard/article-body";
import PostActions from "@/app/dashboard/post-actions";
import AudioPlayer from "@/components/audio-player";
import BackLink from "@/components/back-link";
import TimeAgo from "@/components/time-ago";

const tagStyles: Record<string, { badge: string; emoji: string }> = {
  love: { badge: "bg-pink-50 text-pink-700", emoji: "\u2764\uFE0F" },
  health: { badge: "bg-green-50 text-green-700", emoji: "\uD83C\uDF3F" },
  magic: { badge: "bg-fuchsia-50 text-fuchsia-700", emoji: "\u2728" },
  ask: { badge: "bg-amber-50 text-amber-700", emoji: "\uD83E\uDD0D" },
};

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = isAdmin(user);

  // Fetch bookmarked post IDs
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const postIds = bookmarks?.map((b) => b.post_id) ?? [];

  // Fetch the actual posts
  const { data: posts } = postIds.length
    ? await supabase.from("posts").select("*").in("id", postIds)
    : { data: [] };

  // Sort posts in bookmark order
  const postMap = new Map((posts ?? []).map((p) => [p.id, p]));
  const orderedPosts = postIds
    .map((id) => postMap.get(id))
    .filter(Boolean) as NonNullable<typeof posts>;

  // Fetch likes
  const { data: allLikes } = postIds.length
    ? await supabase
        .from("likes")
        .select("post_id, user_id")
        .in("post_id", postIds)
    : { data: [] };

  const { data: allComments } = postIds.length
    ? await supabase
        .from("comments")
        .select("*")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const likeCounts: Record<string, number> = {};
  const userLiked: Record<string, boolean> = {};
  for (const like of allLikes ?? []) {
    likeCounts[like.post_id] = (likeCounts[like.post_id] ?? 0) + 1;
    if (like.user_id === user.id) userLiked[like.post_id] = true;
  }

  type Comment = NonNullable<typeof allComments>[number];
  const commentsByPost: Record<string, Comment[]> = {};
  const commentCounts: Record<string, number> = {};
  for (const comment of allComments ?? []) {
    if (!commentsByPost[comment.post_id]) commentsByPost[comment.post_id] = [];
    commentsByPost[comment.post_id].push(comment);
    commentCounts[comment.post_id] = (commentCounts[comment.post_id] ?? 0) + 1;
  }

  // Fetch handles for post authors and comment authors
  const allUserIds = [
    ...new Set([
      ...(orderedPosts ?? []).map((p) => p.author_id),
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

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <BackLink />
        <h1 className="text-2xl font-light tracking-tight text-warm-900">
          Saved
        </h1>

        <div className="mt-6 space-y-6">
          {orderedPosts.length > 0 ? (
            orderedPosts.map((post) => {
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
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tag?.badge ?? "bg-warm-100 text-warm-600"}`}
                    >
                      <span>{tag?.emoji}</span>
                      {post.tag === "ask" ? "whisper" : post.tag}
                    </span>
                  </div>

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

                  {post.anonymous_question && (
                    <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                      <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                      <p className="mt-1 text-sm italic text-warm-600">
                        {post.anonymous_question}
                      </p>
                    </div>
                  )}

                  {post.type === "text" && post.body && (
                    <div
                      className="prose prose-sm prose-zinc mt-3 max-w-none px-4"
                      dangerouslySetInnerHTML={{ __html: post.body }}
                    />
                  )}

                  {post.type === "article" && post.body && (
                    <ArticleBody title={post.title} body={post.body} />
                  )}

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

                  <div className="mx-4 mt-3 border-t border-warm-100" />

                  <PostActions
                    postId={post.id}
                    likeCount={likeCounts[post.id] ?? 0}
                    likedByUser={!!userLiked[post.id]}
                    bookmarkedByUser={true}
                    comments={commentsByPost[post.id] ?? []}
                    commentCount={commentCounts[post.id] ?? 0}
                    commentsEnabled={post.comments_enabled}
                    currentUserId={user.id}
                    isAdmin={admin}
                    userHandles={userHandles}
                  />
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">Nothing saved yet.</p>
              <p className="mt-2 text-sm text-warm-400">
                Bookmark posts from the portal to find them here later.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block rounded-full bg-warm-100 px-5 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-200"
              >
                Browse the Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
