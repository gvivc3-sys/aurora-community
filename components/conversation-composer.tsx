"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/conversations";
import { useToast } from "@/components/toast";

export default function ConversationComposer() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("Only image files are allowed.", "error");
      e.target.value = "";
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast("Image must be under 10 MB.", "error");
      e.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function removeImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(formData: FormData) {
    if (file) {
      formData.set("file", file);
    }
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
      {!previewUrl ? (
        <label className="mb-3 inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-warm-500 hover:text-warm-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 4.5h18a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 18V6A1.5 1.5 0 0 1 3 4.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
          Add an image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-warm-200 bg-warm-50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a remote/optimizable image */}
          <img
            src={previewUrl}
            alt="Selected image preview"
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
          <p className="min-w-0 flex-1 truncate text-xs text-warm-500">{file?.name}</p>
          <button
            type="button"
            onClick={removeImage}
            aria-label="Remove image"
            className="shrink-0 text-warm-400 transition-colors hover:text-warm-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
      )}

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
        rows={12}
        required
        className="mt-3 w-full resize-none rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-end">
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
