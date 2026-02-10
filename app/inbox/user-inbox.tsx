"use client";

import { useActionState, useRef } from "react";
import { sendMessage } from "@/lib/actions/messages";
import type { Database } from "@/lib/supabase/types";

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

export default function UserInbox({ messages }: { messages: Message[] }) {
  const [state, formAction, pending] = useActionState(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      {/* Send message section */}
      <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">
          Send a Message
        </h1>
        <p className="mt-2 text-sm text-warm-500">
          Share something privately with the Aurora team. Your identity stays
          between us.
        </p>

        <form
          ref={formRef}
          action={async (formData) => {
            formAction(formData);
            if (formRef.current) formRef.current.reset();
          }}
          className="mt-4 space-y-4"
        >
          <textarea
            name="body"
            required
            maxLength={2000}
            rows={4}
            placeholder="Write your message..."
            className="block w-full resize-none rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-warm-400">Max 2000 characters</p>
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-warm-900 px-6 py-2.5 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send"}
            </button>
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-green-600">
              Message sent successfully.
            </p>
          )}
        </form>
      </div>

      {/* Sent messages */}
      {messages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-light tracking-tight text-warm-900">
            Your Messages
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
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      msg.status === "read"
                        ? "bg-green-50 text-green-700"
                        : "bg-warm-100 text-warm-500"
                    }`}
                  >
                    {msg.status === "read" ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-warm-700">
                  {msg.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
