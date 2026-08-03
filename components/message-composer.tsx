"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendDirectMessage } from "@/lib/actions/dm";
import { useToast } from "@/components/toast";

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    const formData = new FormData();
    formData.set("body", trimmed);

    startTransition(async () => {
      const result = await sendDirectMessage(conversationId, formData);
      if (result?.error) {
        toast(result.error, "error");
        return;
      }
      setBody("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-b-xl border border-t-0 border-warm-200 bg-white p-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Write a message…"
        rows={1}
        maxLength={2000}
        className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-lg border border-warm-200 px-3 py-2 text-base text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none md:text-sm"
      />
      <button
        type="submit"
        disabled={isPending || !body.trim()}
        className="shrink-0 rounded-full bg-warm-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
