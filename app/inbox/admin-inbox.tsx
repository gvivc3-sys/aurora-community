"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import Link from "next/link";
import { markAsRead, markAsAddressed, replyToMessage, deleteMessage } from "@/lib/actions/messages";
import Avatar from "@/components/avatar";
import RichTextEditor from "@/components/rich-text-editor";
import { parseReplies } from "@/lib/replies";
import type { Database } from "@/lib/supabase/types";
import MentionText from "@/components/mention-text";

type Message = Database["public"]["Tables"]["messages"]["Row"];

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

function MarkReadButton({ messageId }: { messageId: string }) {
  const [state, action, pending] = useActionState(markAsRead, null);

  return (
    <form action={action}>
      <input type="hidden" name="messageId" value={messageId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-200 disabled:opacity-50"
      >
        {pending ? "..." : "Mark as read"}
      </button>
      {state?.error && (
        <p className="mt-1 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  );
}

function MarkAddressedButton({ messageId }: { messageId: string }) {
  const [state, action, pending] = useActionState(markAsAddressed, null);

  return (
    <form action={action}>
      <input type="hidden" name="messageId" value={messageId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200 disabled:opacity-50"
      >
        {pending ? "..." : "Mark addressed"}
      </button>
      {state?.error && (
        <p className="mt-1 text-xs text-red-500">{state.error}</p>
      )}
    </form>
  );
}

function DeleteMessageButton({ messageId }: { messageId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(deleteMessage, null);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Are you sure?</span>
        <form action={action}>
          <input type="hidden" name="messageId" value={messageId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {pending ? "..." : "Delete"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-200"
        >
          Cancel
        </button>
        {state?.error && (
          <p className="text-xs text-red-500">{state.error}</p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
    >
      Delete
    </button>
  );
}

function ReplyForm({ messageId }: { messageId: string }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"private" | "public">("private");
  const [state, action, pending] = useActionState(replyToMessage, null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const formKey = useRef(0);

  useEffect(() => {
    if (state?.success) {
      setLastSuccess(
        state.mode === "public"
          ? "Reply posted to Circle."
          : "Private reply sent.",
      );
      setOpen(false);
      formKey.current += 1;
    }
  }, [state]);

  return (
    <div className="space-y-2">
      {lastSuccess && (
        <p className="text-xs font-medium text-green-600">{lastSuccess}</p>
      )}
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setLastSuccess(null);
          }}
          className="rounded-full bg-warm-800 px-3 py-1 text-xs font-medium text-warm-50 transition-colors hover:bg-warm-700"
        >
          Reply
        </button>
      ) : (
        <form key={formKey.current} action={action} className="space-y-2">
          <input type="hidden" name="messageId" value={messageId} />
          <input type="hidden" name="mode" value={mode} />

          {/* Mode toggle */}
          <div className="flex rounded-lg border border-warm-200 p-0.5">
            <button
              type="button"
              onClick={() => setMode("private")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "private"
                  ? "bg-warm-800 text-warm-50"
                  : "text-warm-500 hover:text-warm-700"
              }`}
            >
              Reply privately
            </button>
            <button
              type="button"
              onClick={() => setMode("public")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "public"
                  ? "bg-warm-800 text-warm-50"
                  : "text-warm-500 hover:text-warm-700"
              }`}
            >
              Post to Circle
            </button>
          </div>

          <RichTextEditor
            name="replyBody"
            placeholder="Write your reply..."
            minHeight="4rem"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-warm-800 px-3 py-1 text-xs font-medium text-warm-50 transition-colors hover:bg-warm-700 disabled:opacity-50"
            >
              {pending
                ? "Sending..."
                : mode === "public"
                  ? "Post to Circle"
                  : "Send privately"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-warm-100 px-3 py-1 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-200"
            >
              Cancel
            </button>
          </div>
          {state?.error && (
            <p className="text-xs text-red-500">{state.error}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function AdminInbox({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const filtered =
    filter === "unread"
      ? messages.filter((m) => m.status === "unread")
      : messages;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">
          Whispers
        </h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex border-b border-warm-200">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "border-b-2 border-warm-900 text-warm-900"
              : "text-warm-400 hover:text-warm-600"
          }`}
        >
          All ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            filter === "unread"
              ? "border-b-2 border-warm-900 text-warm-900"
              : "text-warm-400 hover:text-warm-600"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Messages */}
      <div className="mt-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                  msg.status === "unread"
                    ? "border-warm-300"
                    : "border-warm-200"
                }`}
              >
                <div className="flex w-full items-center gap-3 px-4 py-3">
                  <Link href={`/profile/${msg.sender_id}`}>
                    <Avatar
                      src={msg.sender_avatar_url}
                      name={msg.sender_name}
                      size="sm"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : msg.id)
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${msg.sender_id}`} className="truncate text-sm font-medium text-warm-900 hover:underline" onClick={(e) => e.stopPropagation()}>
                          {msg.sender_name ?? "Anonymous"}
                        </Link>
                        {msg.status === "unread" && (
                          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                        )}
                        {msg.status === "addressed" && (
                          <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                            Addressed
                          </span>
                        )}
                      </div>
                      {!isExpanded && (
                        <p className="truncate text-sm text-warm-500">
                          {msg.body}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-warm-400">
                      {timeAgo(msg.created_at)}
                    </span>
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-warm-100 px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm text-warm-700">
                      {msg.body}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.status !== "addressed" && (
                        <>
                          {msg.status === "unread" && (
                            <MarkReadButton messageId={msg.id} />
                          )}
                          <MarkAddressedButton messageId={msg.id} />
                        </>
                      )}
                      <DeleteMessageButton messageId={msg.id} />
                    </div>
                    {msg.reply_body && (() => {
                      const replies = parseReplies(msg.reply_body);
                      return replies.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {replies.map((reply, i) => (
                            <div key={i} className={`rounded-lg px-3 py-2 ${
                              reply.role === "user"
                                ? "border-l-2 border-warm-300 bg-warm-100/50"
                                : "bg-warm-50"
                            }`}>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-medium text-warm-500">
                                  {reply.author_name} replied
                                  {reply.role === "admin" && (
                                    <span className="ml-1 text-warm-400">
                                      · {reply.mode === "public" ? "Posted to Circle" : "Private"}
                                    </span>
                                  )}
                                </p>
                                {reply.created_at && (
                                  <span className="text-xs text-warm-400">
                                    {timeAgo(reply.created_at)}
                                  </span>
                                )}
                              </div>
                              {reply.role === "user" ? (
                                <p className="mt-1 whitespace-pre-wrap text-sm text-warm-700"><MentionText text={reply.body} /></p>
                              ) : (
                                <div
                                  className="prose prose-sm prose-zinc mt-1 max-w-none text-warm-700"
                                  dangerouslySetInnerHTML={{ __html: reply.body }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null;
                    })()}
                    <div className="mt-3 border-t border-warm-100 pt-3">
                      <ReplyForm messageId={msg.id} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="py-12 text-center text-warm-400">
            {filter === "unread"
              ? "No unread messages."
              : "No messages yet."}
          </p>
        )}
      </div>
    </div>
  );
}
