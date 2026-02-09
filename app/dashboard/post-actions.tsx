"use client";

import { useActionState, useRef, useState } from "react";
import { addComment, deleteComment, deletePost, toggleLike } from "@/lib/actions/post";
import Avatar from "@/components/avatar";
import EmojiPopover from "@/components/emoji-popover";

type Comment = {
  id: string;
  author_name: string | null;
  author_avatar_url: string | null;
  user_id: string;
  body: string;
  created_at: string;
};

type PostActionsProps = {
  postId: string;
  likeCount: number;
  likedByUser: boolean;
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

export default function PostActions({
  postId,
  likeCount,
  likedByUser,
  comments,
  commentCount,
  commentsEnabled,
  currentUserId,
  isAdmin,
}: PostActionsProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Like
  const [likeState, likeAction, likePending] = useActionState(toggleLike, null);
  const liked = likeState ? likeState.liked : likedByUser;
  const displayLikeCount = likeState
    ? likeCount +
      (likeState.liked ? (likedByUser ? 0 : 1) : likedByUser ? -1 : 0)
    : likeCount;

  // Delete post
  const [deleteState, deleteAction, deletePending] = useActionState(deletePost, null);

  // Add comment
  const [addState, addAction, addPending] = useActionState(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Delete comment
  const [, deleteCommentAction, deleteCommentPending] = useActionState(deleteComment, null);

  return (
    <div>
      {/* Action bar */}
      <div className="flex items-center px-4 py-3">
        {/* Like button */}
        <form action={likeAction}>
          <input type="hidden" name="postId" value={postId} />
          <button
            type="submit"
            disabled={likePending}
            className="flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
          >
            {liked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-red-500"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-zinc-400 hover:text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
            <span className={liked ? "text-red-500" : "text-zinc-400"}>
              {displayLikeCount > 0 ? displayLikeCount : ""}
            </span>
          </button>
        </form>

        {/* Comment toggle */}
        <button
          type="button"
          onClick={() => setCommentsOpen(!commentsOpen)}
          disabled={!commentsEnabled}
          className="ml-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
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

        {/* Delete (admin only, pushed right) */}
        {isAdmin && (
          <form action={deleteAction} className="ml-auto">
            <input type="hidden" name="postId" value={postId} />
            {deleteState?.error && (
              <span className="mr-2 text-xs text-red-600">
                {deleteState.error}
              </span>
            )}
            <button
              type="submit"
              disabled={deletePending}
              className="text-sm text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
            >
              {deletePending ? "Deleting..." : "Delete"}
            </button>
          </form>
        )}
      </div>

      {/* Comment panel — own area beneath the action bar */}
      {commentsOpen && commentsEnabled && (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="shrink-0 pt-0.5">
                    <Avatar
                      src={comment.author_avatar_url}
                      name={comment.author_name}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-zinc-900">
                        {comment.author_name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {timeAgo(comment.created_at)}
                      </span>
                      {(comment.user_id === currentUserId || isAdmin) && (
                        <form action={deleteCommentAction} className="inline">
                          <input
                            type="hidden"
                            name="commentId"
                            value={comment.id}
                          />
                          <button
                            type="submit"
                            disabled={deleteCommentPending}
                            className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-zinc-700">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">
              No comments yet. Be the first!
            </p>
          )}

          {/* Add comment — full width */}
          <form
            ref={formRef}
            action={async (formData) => {
              await addAction(formData);
              formRef.current?.reset();
            }}
            className="mt-4"
          >
            <input type="hidden" name="postId" value={postId} />
            <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-1 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
              <input
                ref={commentInputRef}
                name="body"
                type="text"
                required
                maxLength={500}
                placeholder="Write a comment..."
                className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0"
              />
              <EmojiPopover
                onSelect={(emoji) => {
                  const input = commentInputRef.current;
                  if (input) {
                    const start = input.selectionStart ?? input.value.length;
                    const end = input.selectionEnd ?? input.value.length;
                    const nativeInputValueSetter =
                      Object.getOwnPropertyDescriptor(
                        HTMLInputElement.prototype,
                        "value",
                      )?.set;
                    nativeInputValueSetter?.call(
                      input,
                      input.value.slice(0, start) +
                        emoji +
                        input.value.slice(end),
                    );
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.focus();
                    input.setSelectionRange(
                      start + emoji.length,
                      start + emoji.length,
                    );
                  }
                }}
              />
              <button
                type="submit"
                disabled={addPending}
                className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
              >
                {addPending ? "..." : "Post"}
              </button>
            </div>
          </form>
          {addState?.error && (
            <p className="mt-1 text-xs text-red-600">{addState.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
