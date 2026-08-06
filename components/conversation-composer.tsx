"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/conversations";
import { useToast } from "@/components/toast";

export default function ConversationComposer() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState("");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createThread(null, formData);
      if (result?.error) {
        toast(result.error, "error");
        return;
      }
      if (result?.threadId) {
        router.push(`/conversations/${result.threadId}`);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Give it a title"
        maxLength={120}
        required
        className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
      />
      <textarea
        name="body"
        placeholder="What's on your mind?"
        maxLength={2000}
        rows={3}
        required
        className="mt-3 w-full resize-none rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
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
          className="shrink-0 rounded-lg bg-warm-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Posting…" : "Start a discussion"}
        </button>
      </div>
    </form>
  );
}
