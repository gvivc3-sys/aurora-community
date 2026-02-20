"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { sendMessage, replyToReply, deleteMessage } from "@/lib/actions/messages";
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

function formatRemaining(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000);
  if (totalMinutes >= 60) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${totalMinutes}m`;
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

function UserReplyForm({ messageId }: { messageId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(replyToReply, null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const formKey = useRef(0);

  useEffect(() => {
    if (state?.success) {
      setLastSuccess("Reply sent.");
      setOpen(false);
      formKey.current += 1;
    }
  }, [state]);

  return (
    <div className="mt-3 space-y-2">
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
          <textarea
            name="replyBody"
            required
            maxLength={500}
            rows={3}
            placeholder="Write your reply..."
            className="block w-full resize-none rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-warm-800 px-3 py-1 text-xs font-medium text-warm-50 transition-colors hover:bg-warm-700 disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send reply"}
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

export default function UserInbox({
  messages,
  canSendAfter,
  userId,
}: {
  messages: Message[];
  canSendAfter: string | null;
  userId: string;
}) {
  const [state, formAction, pending] = useActionState(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [anonymous, setAnonymous] = useState(true);

  useEffect(() => {
    if (!canSendAfter) {
      setRemaining(0);
      return;
    }

    const update = () => {
      const ms = new Date(canSendAfter).getTime() - Date.now();
      setRemaining(ms > 0 ? ms : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [canSendAfter]);

  const onCooldown = remaining > 0;

  return (
    <div>
      {/* Send message section */}
      <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">
          Whisper
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-warm-500">
          Share what&apos;s on your heart &mdash; a question, an intention, or
          something you&apos;re navigating. Ashley will read your whisper and
          may share her response with the sacred circle for the community to
          reflect on. Your identity is yours to reveal.
        </p>

        {onCooldown && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              You can whisper again in {formatRemaining(remaining)}.
            </p>
          </div>
        )}

        <form
          ref={formRef}
          action={async (formData) => {
            formAction(formData);
            if (formRef.current) formRef.current.reset();
          }}
          className="mt-4 space-y-4"
        >
          <input type="hidden" name="anonymous" value={anonymous ? "on" : ""} />

          {/* Anonymous / Named toggle */}
          <div>
            <div className="flex rounded-lg border border-warm-200 p-0.5">
              <button
                type="button"
                onClick={() => setAnonymous(true)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  anonymous
                    ? "bg-warm-800 text-warm-50"
                    : "text-warm-500 hover:text-warm-700"
                }`}
              >
                Anonymous
              </button>
              <button
                type="button"
                onClick={() => setAnonymous(false)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  !anonymous
                    ? "bg-warm-800 text-warm-50"
                    : "text-warm-500 hover:text-warm-700"
                }`}
              >
                Named
              </button>
            </div>
            <p className="mt-1.5 text-xs text-warm-400">
              {anonymous
                ? "Anonymous \u2014 Ashley won\u2019t see your name"
                : "Named \u2014 Ashley will see your profile"}
            </p>
          </div>

          <textarea
            name="body"
            required
            maxLength={2000}
            rows={4}
            disabled={onCooldown}
            placeholder="Write your whisper..."
            className="block w-full resize-none rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500 disabled:bg-warm-50 disabled:text-warm-400"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-warm-400">Max 2000 characters</p>
            <button
              type="submit"
              disabled={pending || onCooldown}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-6 py-2.5 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {pending ? "Sending..." : "Send"}
            </button>
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-green-600">
              Whisper sent successfully.
            </p>
          )}
        </form>
      </div>

      {/* Sent messages */}
      {messages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-light tracking-tight text-warm-900">
            Your Whispers
          </h2>
          <div className="mt-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-warm-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-warm-400">
                    {timeAgo(msg.created_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        msg.status === "addressed"
                          ? "bg-green-100 text-green-700"
                          : msg.status === "read"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-warm-100 text-warm-500"
                      }`}
                    >
                      {msg.status === "addressed"
                        ? "Addressed"
                        : msg.status === "read"
                          ? "Read"
                          : "Sent"}
                    </span>
                    <DeleteMessageButton messageId={msg.id} />
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-warm-700">
                  {msg.body}
                </p>
                {msg.reply_body && (() => {
                  const replies = parseReplies(msg.reply_body);
                  const hasAdminReply = replies.some((r) => r.role === "admin");
                  return replies.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {replies.map((reply, i) => (
                        <div key={i} className={`rounded-lg border px-3 py-2.5 ${
                          reply.role === "user"
                            ? "border-warm-200 bg-warm-100/50"
                            : "border-warm-200 bg-warm-50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-warm-500">
                              {reply.role === "user"
                                ? "You replied"
                                : `${reply.author_name} whispered back`}
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
                      {hasAdminReply && (
                        <UserReplyForm messageId={msg.id} />
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
