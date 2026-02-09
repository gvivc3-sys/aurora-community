"use client";

import { useActionState, useState } from "react";
import { addComment, deleteComment } from "@/lib/actions/post";
import Avatar from "@/components/avatar";

type Comment = {
  id: string;
  author_name: string | null;
  author_avatar_url: string | null;
  user_id: string;
  body: string;
  created_at: string;
};

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
  commentCount: number;
  commentsEnabled: boolean;
  currentUserId: string;
  isAdmin: boolean;
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

function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [, formAction, pending] = useActionState(deleteComment, null);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="commentId" value={commentId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
      >
        {pending ? "..." : "Delete"}
      </button>
    </form>
  );
}

export default function CommentSection({
  postId,
  comments,
  commentCount,
  commentsEnabled,
  currentUserId,
  isAdmin,
}: CommentSectionProps) {
  const [open, setOpen] = useState(false);
  const [addState, addFormAction, addPending] = useActionState(
    addComment,
    null,
  );

  return (
    <>
      {/* Comment toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={!commentsEnabled}
        className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
        title={commentsEnabled ? "Comments" : "Comments disabled"}
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
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
          />
        </svg>
        {commentCount > 0 && <span>{commentCount}</span>}
      </button>

      {/* Comment panel */}
      {open && commentsEnabled && (
        <div className="col-span-full mt-3 border-t border-zinc-100 pt-3">
          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar
                    src={comment.author_avatar_url}
                    name={comment.author_name}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-zinc-900">
                        {comment.author_name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {timeAgo(comment.created_at)}
                      </span>
                      {(comment.user_id === currentUserId || isAdmin) && (
                        <DeleteCommentButton commentId={comment.id} />
                      )}
                    </div>
                    <p className="text-sm text-zinc-700">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment form */}
          <form action={addFormAction} className="mt-3 flex gap-2">
            <input type="hidden" name="postId" value={postId} />
            <input
              name="body"
              type="text"
              required
              maxLength={500}
              placeholder="Write a comment..."
              className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            <button
              type="submit"
              disabled={addPending}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {addPending ? "..." : "Post"}
            </button>
          </form>
          {addState?.error && (
            <p className="mt-1 text-xs text-red-600">{addState.error}</p>
          )}
        </div>
      )}
    </>
  );
}
