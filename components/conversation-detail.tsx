"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  replyToThread,
  deleteThread,
  deleteThreadReply,
  toggleThreadReaction,
} from "@/lib/actions/conversations";
import Avatar from "@/components/avatar";
import TimeAgo from "@/components/time-ago";
import PostAttachment from "@/components/post-attachment";
import { HeartIcon } from "@/components/icons";
import { useToast } from "@/components/toast";

export type ReplyItem = {
  id: string;
  author_id: string;
  author_name: string | null;
  author_avatar_url: string | null;
  body: string;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  reactionCount: number;
  reactedByMe: boolean;
};

function ReactionButton({
  threadId,
  replyId,
  count,
  reacted,
}: {
  threadId?: string;
  replyId?: string;
  count: number;
  reacted: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(
    { reacted, count },
    (state) => ({ reacted: !state.reacted, count: state.count + (state.reacted ? -1 : 1) }),
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setOptimistic(null);
        startTransition(async () => {
          await toggleThreadReaction(null, formData);
        });
      }}
    >
      {threadId && <input type="hidden" name="threadId" value={threadId} />}
      {replyId && <input type="hidden" name="replyId" value={replyId} />}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1 text-sm transition-colors disabled:opacity-60"
      >
        <HeartIcon
          className={`h-4 w-4 transition-colors ${
            optimistic.reacted ? "fill-red-500 stroke-red-500" : "fill-none stroke-warm-400 hover:stroke-red-400"
          }`}
        />
        <span className={optimistic.reacted ? "text-red-500" : "text-warm-400"}>
          {optimistic.count > 0 ? optimistic.count : ""}
        </span>
      </button>
    </form>
  );
}

function DeleteButton({ label, onDelete }: { label: string; onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <span className="text-warm-500">Delete this {label}?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(onDelete)}
          className="font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          Yes
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-warm-400 hover:text-warm-600">
          No
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className="text-xs text-red-400 hover:text-red-600">
      Delete
    </button>
  );
}

export default function ConversationDetail({
  thread,
  replies,
  currentUserId,
  isAdmin,
}: {
  thread: {
    id: string;
    title: string;
    body: string;
    author_id: string;
    author_name: string | null;
    author_avatar_url: string | null;
    file_url: string | null;
    file_type: string | null;
    created_at: string;
    reactionCount: number;
    reactedByMe: boolean;
  };
  replies: ReplyItem[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState("");

  function handleReply(formData: FormData) {
    startTransition(async () => {
      const result = await replyToThread(null, formData);
      if (result?.error) {
        toast(result.error, "error");
        return;
      }
      formRef.current?.reset();
      setFileName("");
      router.refresh();
    });
  }

  async function handleDeleteThread() {
    const formData = new FormData();
    formData.set("threadId", thread.id);
    const result = await deleteThread(null, formData);
    if (result?.error) {
      toast(result.error, "error");
      return;
    }
    router.push("/conversations");
  }

  async function handleDeleteReply(replyId: string) {
    const formData = new FormData();
    formData.set("replyId", replyId);
    formData.set("threadId", thread.id);
    const result = await deleteThreadReply(null, formData);
    if (result?.error) {
      toast(result.error, "error");
      return;
    }
    router.refresh();
  }

  const canDeleteThread = isAdmin || thread.author_id === currentUserId;

  return (
    <div>
      {/* OP */}
      <div className="rounded-xl border border-warm-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${thread.author_id}`} className="shrink-0">
            <Avatar src={thread.author_avatar_url} name={thread.author_name} size="sm" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link href={`/profile/${thread.author_id}`} className="text-sm font-medium text-warm-900 hover:underline">
                {thread.author_name || "Unknown"}
              </Link>
              <span className="text-warm-300">·</span>
              <TimeAgo date={thread.created_at} className="text-xs text-warm-400" />
            </div>
            <h1 className="mt-1 text-lg font-medium text-warm-900">{thread.title}</h1>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-warm-700">{thread.body}</p>
          </div>
        </div>
        {thread.file_url && (
          <PostAttachment fileUrl={thread.file_url} fileType={thread.file_type} />
        )}
        <div className="mt-3 flex items-center gap-4">
          <ReactionButton threadId={thread.id} count={thread.reactionCount} reacted={thread.reactedByMe} />
          {canDeleteThread && <DeleteButton label="discussion" onDelete={handleDeleteThread} />}
        </div>
      </div>

      {/* Replies */}
      <div className="mt-4 space-y-3">
        {replies.map((reply) => {
          const canDeleteReply = isAdmin || reply.author_id === currentUserId;
          return (
            <div key={reply.id} className="flex items-start gap-3 rounded-xl border border-warm-200 bg-white p-4 shadow-sm">
              <Link href={`/profile/${reply.author_id}`} className="shrink-0">
                <Avatar src={reply.author_avatar_url} name={reply.author_name} size="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Link href={`/profile/${reply.author_id}`} className="text-sm font-medium text-warm-900 hover:underline">
                    {reply.author_name || "Unknown"}
                  </Link>
                  <span className="text-warm-300">·</span>
                  <TimeAgo date={reply.created_at} className="text-xs text-warm-400" />
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-warm-700">{reply.body}</p>
                {reply.file_url && (
                  <PostAttachment fileUrl={reply.file_url} fileType={reply.file_type} />
                )}
                <div className="mt-2 flex items-center gap-4">
                  <ReactionButton replyId={reply.id} count={reply.reactionCount} reacted={reply.reactedByMe} />
                  {canDeleteReply && <DeleteButton label="reply" onDelete={() => handleDeleteReply(reply.id)} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply composer */}
      <form
        ref={formRef}
        action={handleReply}
        className="mt-4 rounded-xl border border-warm-200 bg-white p-4 shadow-sm"
      >
        <input type="hidden" name="threadId" value={thread.id} />
        <textarea
          name="body"
          placeholder="Write a reply…"
          maxLength={1000}
          rows={2}
          required
          className="w-full resize-none rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-warm-500 hover:text-warm-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 4.5h18a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 18V6A1.5 1.5 0 0 1 3 4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
            {fileName || "Add an image"}
            <input
              type="file"
              name="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 rounded-full bg-warm-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Posting…" : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
