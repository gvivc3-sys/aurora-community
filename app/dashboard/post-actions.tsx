"use client";

import { useActionState, useOptimistic, useRef, useState } from "react";
import { addComment, deleteComment, deletePost, toggleLike, toggleBookmark } from "@/lib/actions/post";
import Avatar from "@/components/avatar";

const EMOJIS = ["\u2764\uFE0F", "\uD83D\uDE0A", "\uD83D\uDE02", "\uD83D\uDD25", "\uD83D\uDC4F", "\uD83D\uDE4C", "\u2728", "\uD83D\uDCAF", "\uD83C\uDF89", "\uD83D\uDC40", "\uD83D\uDCAA", "\uD83D\uDE4F"];

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
  bookmarkedByUser: boolean;
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
  bookmarkedByUser,
  comments,
  commentCount,
  commentsEnabled,
  currentUserId,
  isAdmin,
}: PostActionsProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  // Like — optimistic
  const [optimistic, setOptimistic] = useOptimistic(
    { liked: likedByUser, count: likeCount },
    (state) => ({
      liked: !state.liked,
      count: state.count + (state.liked ? -1 : 1),
    }),
  );
  const [, likeAction] = useActionState(toggleLike, null);
  const liked = optimistic.liked;
  const displayLikeCount = optimistic.count;

  // Bookmark — optimistic
  const [optimisticBookmark, setOptimisticBookmark] = useOptimistic(
    bookmarkedByUser,
    (state) => !state,
  );
  const [, bookmarkAction] = useActionState(toggleBookmark, null);

  // Delete post
  const [deleteState, deleteAction, deletePending] = useActionState(deletePost, null);

  // Add comment
  const [addState, addAction, addPending] = useActionState(addComment, null);
  const formRef = useRef<HTMLFormElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  // Delete comment
  const [, deleteCommentAction, deleteCommentPending] = useActionState(deleteComment, null);

  return (
    <div>
      {/* Action bar */}
      <div className="flex items-center px-4 py-3">
        {/* Like button */}
        <form action={async (formData) => {
          setOptimistic(null);
          await likeAction(formData);
        }}>
          <input type="hidden" name="postId" value={postId} />
          <button
            type="submit"
            className="flex items-center gap-1 text-sm transition-colors"
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
                className="h-5 w-5 text-warm-400 hover:text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
            <span className={liked ? "text-red-500" : "text-warm-400"}>
              {displayLikeCount > 0 ? displayLikeCount : ""}
            </span>
          </button>
        </form>

        {/* Comment toggle */}
        <button
          type="button"
          onClick={() => setCommentsOpen(!commentsOpen)}
          disabled={!commentsEnabled}
          className="ml-4 flex items-center gap-1 text-sm text-warm-400 transition-colors hover:text-warm-600 disabled:cursor-not-allowed disabled:opacity-40"
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

        {/* Bookmark */}
        <form action={async (formData) => {
          setOptimisticBookmark(null);
          await bookmarkAction(formData);
        }}>
          <input type="hidden" name="postId" value={postId} />
          <button
            type="submit"
            className="ml-4 text-sm transition-colors"
            title={optimisticBookmark ? "Remove bookmark" : "Bookmark"}
          >
            {optimisticBookmark ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-warm-700">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-warm-400 hover:text-warm-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            )}
          </button>
        </form>

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
              className="text-sm text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
            >
              {deletePending ? "Deleting..." : "Delete"}
            </button>
          </form>
        )}
      </div>

      {/* Comment panel — own area beneath the action bar */}
      {commentsOpen && commentsEnabled && (
        <div className="border-t border-warm-100 px-4 pb-4 pt-3">
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
                      <span className="text-sm font-medium text-warm-900">
                        {comment.author_name ?? "Unknown"}
                      </span>
                      <span className="text-xs text-warm-400">
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
                    <p className="mt-0.5 text-sm text-warm-700">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-400">
              No comments yet. Be the first!
            </p>
          )}

          {/* Add comment — full width */}
          <form
            ref={formRef}
            action={async (formData) => {
              await addAction(formData);
              formRef.current?.reset();
              setShowEmojis(false);
            }}
            className="mt-4"
          >
            <input type="hidden" name="postId" value={postId} />
            <div className="overflow-hidden rounded-lg border border-warm-300 focus-within:border-warm-500 focus-within:ring-1 focus-within:ring-warm-500">
              <div className="flex w-full items-center gap-1 px-2">
                <input
                  ref={commentInputRef}
                  name="body"
                  type="text"
                  required
                  maxLength={500}
                  placeholder="Write a comment..."
                  className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`rounded p-1 text-base transition-colors ${showEmojis ? "bg-warm-200" : "hover:bg-warm-100"}`}
                  title="Emoji"
                >
                  {"\uD83D\uDE0A"}
                </button>
              </div>
              {showEmojis && (
                <div className="flex flex-wrap gap-1 border-t border-warm-200 bg-warm-50 px-2 py-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        const input = commentInputRef.current;
                        if (input) {
                          const pos = input.selectionStart ?? input.value.length;
                          const before = input.value.slice(0, pos);
                          const after = input.value.slice(pos);
                          const nativeSetter =
                            Object.getOwnPropertyDescriptor(
                              HTMLInputElement.prototype,
                              "value",
                            )?.set;
                          nativeSetter?.call(input, before + emoji + after);
                          input.dispatchEvent(
                            new Event("input", { bubbles: true }),
                          );
                          input.focus();
                          const newPos = pos + emoji.length;
                          input.setSelectionRange(newPos, newPos);
                        }
                      }}
                      className="rounded p-1 text-xl transition-transform hover:scale-125 hover:bg-warm-200"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={addPending}
              className="mt-3 w-full rounded-full bg-warm-900 px-4 py-2 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-50"
            >
              {addPending ? "Posting..." : "Post Comment"}
            </button>
          </form>
          {addState?.error && (
            <p className="mt-1 text-xs text-red-600">{addState.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
