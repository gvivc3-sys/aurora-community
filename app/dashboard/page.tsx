import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVideoId, getEmbedUrl } from "@/lib/video";
import Avatar from "@/components/avatar";
import PostForm from "./post-form";
import DeletePostButton from "./delete-post-button";
import LikeButton from "./like-button";
import ArticleBody from "./article-body";

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

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

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

        <div className="mt-8 space-y-6">
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
                  {/* Header: author info */}
                  <div className="flex items-center gap-3 px-4 pt-4">
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
      </div>
    </div>
  );
}
