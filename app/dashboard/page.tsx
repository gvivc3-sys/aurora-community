import { redirect } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import PostForm from "./post-form";
import DeletePostButton from "./delete-post-button";
import LikeButton from "./like-button";
import ArticleBody from "./article-body";
import FeedFilters from "./feed-filters";

const PAGE_SIZE = 20;

const tagColors: Record<string, string> = {
  love: "bg-pink-100 text-pink-700",
  health: "bg-green-100 text-green-700",
  magic: "bg-purple-100 text-purple-700",
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

  // Compute like counts and user-liked per post
  const likeCounts: Record<string, number> = {};
  const userLiked: Record<string, boolean> = {};
  for (const like of allLikes ?? []) {
    likeCounts[like.post_id] = (likeCounts[like.post_id] ?? 0) + 1;
    if (like.user_id === user.id) {
      userLiked[like.post_id] = true;
    }
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
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Posts</h1>
        <p className="mt-2 text-zinc-500">
          Latest posts from the community.
        </p>

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

              return (
                <div
                  key={post.id}
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
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
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {post.author_name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {timeAgo(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColors[post.tag] ?? "bg-zinc-100 text-zinc-600"}`}
                    >
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
                        <div className="prose prose-sm prose-zinc mt-3 max-w-none px-4">
                          <Markdown>{post.body}</Markdown>
                        </div>
                      )}
                    </>
                  )}

                  {/* Text post body (rendered as markdown) */}
                  {post.type === "text" && post.body && (
                    <div className="prose prose-sm prose-zinc mt-3 max-w-none px-4">
                      <Markdown>{post.body}</Markdown>
                    </div>
                  )}

                  {/* Article post body (collapsible) */}
                  {post.type === "article" && post.body && (
                    <ArticleBody title={post.title} body={post.body} />
                  )}

                  {/* Footer: like + delete */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <LikeButton
                      postId={post.id}
                      likeCount={likeCounts[post.id] ?? 0}
                      likedByUser={!!userLiked[post.id]}
                    />
                    {admin && <DeletePostButton postId={post.id} />}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-12 text-center text-zinc-400">No posts yet.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-200"
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
