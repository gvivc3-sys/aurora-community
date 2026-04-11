"use client";

import { useActionState, useOptimistic, useRef, useState } from "react";
import Link from "next/link";
import { addComment, deleteComment, deletePost, toggleLike, toggleBookmark, togglePinPost } from "@/lib/actions/post";
import Avatar from "@/components/avatar";
import { HeartIcon, ChatBubbleIcon, MapPinIcon, MapPinSolidIcon, ArrowTopRightIcon } from "@/components/icons";

/** Render @handles in comment text as links using pre-resolved handle map */
function CommentBody({ text, userHandles }: { text: string; userHandles: Record<string, string> }) {
  // Build reverse map: handle → userId
  const handleToUserId: Record<string, string> = {};
  for (const [userId, handle] of Object.entries(userHandles)) {
    handleToUserId[handle] = userId;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /@([a-z][a-z0-9_]{2,19})\b/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const handle = match[1];
    const userId = handleToUserId[handle];
    if (userId) {
      parts.push(
        <Link key={match.index} href={`/profile/${userId}`} className="font-semibold text-warm-600 hover:underline">
          @{handle}
        </Link>
      );
    } else {
      parts.push(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

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
  postAuthorId?: string;
  likeCount: number;
  likedByUser: boolean;
  bookmarkedByUser: boolean;
  comments: Comment[];
  commentCount: number;
  commentsEnabled: boolean;
  currentUserId: string;
  isAdmin: boolean;
  userHandles: Record<string, string>;
  pinned?: boolean;
  defaultCommentsOpen?: boolean;
  hideFocusLink?: boolean;
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
  postAuthorId,
  likeCount,
  likedByUser,
  bookmarkedByUser,
  comments,
  commentCount,
  commentsEnabled,
  currentUserId,
  isAdmin,
  userHandles,
  pinned = false,
  defaultCommentsOpen = false,
  hideFocusLink = false,
}: PostActionsProps) {
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [confirmingDeletePost, setConfirmingDeletePost] = useState(false);
  const [confirmingDeleteCommentId, setConfirmingDeleteCommentId] = useState<string | null>(null);

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

  // Pin — optimistic
  const [optimisticPinned, setOptimisticPinned] = useOptimistic(
    pinned,
    (state) => !state,
  );
  const [pinState, pinAction, pinPending] = useActionState(togglePinPost, null);

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
            <HeartIcon className={`h-5 w-5 transition-colors ${liked ? "fill-red-500 stroke-red-500" : "stroke-warm-400 hover:stroke-red-400 fill-none"}`} />
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
          <ChatBubbleIcon className="h-5 w-5" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </button>

        {/* Pin (admin only, icon-only) */}
        {isAdmin && (
          <form action={async (formData) => {
            setOptimisticPinned(null);
            await pinAction(formData);
          }} className="ml-4">
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="pinned" value={String(optimisticPinned)} />
            <button
              type="submit"
              disabled={pinPending}
              className="flex items-center text-sm transition-colors disabled:opacity-50"
              title={optimisticPinned ? "Unpin post" : "Pin post"}
            >
              {optimisticPinned ? (
                <MapPinSolidIcon className="h-5 w-5 text-warm-700" />
              ) : (
                <MapPinIcon className="h-5 w-5 text-warm-400 hover:text-warm-600" />
              )}
            </button>
            {pinState?.error && (
              <span className="text-xs text-red-600">{pinState.error}</span>
            )}
          </form>
        )}

        {/* Bookmark */}
        <form action={async (formData) => {
          setOptimisticBookmark(null);
          await bookmarkAction(formData);
        }}>
          <input type="hidden" name="postId" value={postId} />
          <button
            type="submit"
            className="ml-4 flex items-center text-sm transition-colors"
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

        {/* Focus view */}
        {!hideFocusLink && (
          <Link
            href={`/post/${postId}`}
            className="ml-4 flex items-center text-sm text-warm-400 transition-colors hover:text-warm-600"
            title="View post"
          >
            <ArrowTopRightIcon className="h-5 w-5" />
          </Link>
        )}

        {/* Delete (admin or post author, pushed right) */}
        {(isAdmin || postAuthorId === currentUserId) && (
          <form action={deleteAction} className="ml-auto flex items-center gap-2">
            <input type="hidden" name="postId" value={postId} />
            {deleteState?.error && (
              <span className="text-xs text-red-600">{deleteState.error}</span>
            )}
            {confirmingDeletePost ? (
              <>
                <span className="text-xs text-warm-500">Are you sure?</span>
                <button
                  type="submit"
                  disabled={deletePending}
                  className="text-xs font-medium text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                >
                  {deletePending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDeletePost(false)}
                  className="text-xs text-warm-400 transition-colors hover:text-warm-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDeletePost(true)}
                className="text-sm text-red-400 transition-colors hover:text-red-600"
              >
                Delete
              </button>
            )}
          </form>
        )}
      </div>

      {/* Comment preview — always show latest 3 when there are comments */}
      {!commentsOpen && commentsEnabled && comments.length > 0 && (
        <div className="border-t border-warm-100 px-4 pb-3 pt-3">
          <div className="relative">
            {comments.length > 3 && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent" />
            )}
            <div className="space-y-3">
              {comments.slice(-3).map((comment) => {
                const handle = userHandles[comment.user_id];
                const canDelete = comment.user_id === currentUserId || isAdmin;
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Link href={`/profile/${comment.user_id}`} className="shrink-0 pt-0.5">
                      <Avatar
                        src={comment.author_avatar_url}
                        name={comment.author_name}
                        size="sm"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/profile/${comment.user_id}`} className="shrink-0 text-sm font-medium text-warm-900 hover:underline">
                          {comment.author_name ?? "Unknown"}
                        </Link>
                        {handle && (
                          <Link href={`/profile/${comment.user_id}`} className="shrink-0 text-xs font-medium text-warm-500 hover:underline">
                            @{handle}
                          </Link>
                        )}
                        <span className="shrink-0 text-warm-300">·</span>
                        <span className="shrink-0 text-xs text-warm-400">
                          {timeAgo(comment.created_at)}
                        </span>
                        {canDelete && (
                          <form action={deleteCommentAction} className="ml-auto shrink-0 flex items-center gap-1.5">
                            <input type="hidden" name="commentId" value={comment.id} />
                            {confirmingDeleteCommentId === comment.id ? (
                              <>
                                <span className="text-xs text-warm-500">Are you sure?</span>
                                <button
                                  type="submit"
                                  disabled={deleteCommentPending}
                                  className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeleteCommentId(null)}
                                  className="text-xs text-warm-400 hover:text-warm-600"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteCommentId(comment.id)}
                                className="text-xs text-red-400 hover:text-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </form>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-warm-700">
                        <CommentBody text={comment.body} userHandles={userHandles} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {comments.length > 3 && (
            <button
              type="button"
              onClick={() => setCommentsOpen(true)}
              className="mt-2 text-xs font-medium text-warm-500 hover:text-warm-700"
            >
              View all {commentCount} comments
            </button>
          )}
        </div>
      )}

      {/* Full comment panel — expanded */}
      {commentsOpen && commentsEnabled && (
        <div className="border-t border-warm-100 px-4 pb-4 pt-3">
          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => {
                const handle = userHandles[comment.user_id];
                const canDelete = comment.user_id === currentUserId || isAdmin;
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Link href={`/profile/${comment.user_id}`} className="shrink-0 pt-0.5">
                      <Avatar
                        src={comment.author_avatar_url}
                        name={comment.author_name}
                        size="sm"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/profile/${comment.user_id}`} className="shrink-0 text-sm font-medium text-warm-900 hover:underline">
                          {comment.author_name ?? "Unknown"}
                        </Link>
                        {handle && (
                          <Link href={`/profile/${comment.user_id}`} className="shrink-0 text-xs font-medium text-warm-500 hover:underline">
                            @{handle}
                          </Link>
                        )}
                        <span className="shrink-0 text-warm-300">·</span>
                        <span className="shrink-0 text-xs text-warm-400">
                          {timeAgo(comment.created_at)}
                        </span>
                        {canDelete && (
                          <form action={deleteCommentAction} className="ml-auto shrink-0 flex items-center gap-1.5">
                            <input type="hidden" name="commentId" value={comment.id} />
                            {confirmingDeleteCommentId === comment.id ? (
                              <>
                                <span className="text-xs text-warm-500">Are you sure?</span>
                                <button
                                  type="submit"
                                  disabled={deleteCommentPending}
                                  className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeleteCommentId(null)}
                                  className="text-xs text-warm-400 hover:text-warm-600"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteCommentId(comment.id)}
                                className="text-xs text-red-400 hover:text-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </form>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-warm-700">
                        <CommentBody text={comment.body} userHandles={userHandles} />
                      </p>
                    </div>
                  </div>
                );
              })}
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
              className="mt-3 w-full rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-4 py-2 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
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
