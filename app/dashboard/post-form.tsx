"use client";

import { useActionState, useState } from "react";
import { createPost } from "@/lib/actions/post";

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, null);
  const [type, setType] = useState<"video" | "text">("video");

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Create a Post</h2>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setType("video")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            type === "video"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Video
        </button>
        <button
          type="button"
          onClick={() => setType("text")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            type === "text"
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Text
        </button>
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="type" value={type} />

        {type === "video" && (
          <>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-700"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="Video title"
              />
            </div>
            <div>
              <label
                htmlFor="video_url"
                className="block text-sm font-medium text-zinc-700"
              >
                Video URL
              </label>
              <input
                id="video_url"
                name="video_url"
                type="url"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="YouTube or Vimeo URL"
              />
            </div>
          </>
        )}

        {type === "text" && (
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-zinc-700"
            >
              What&apos;s on your mind?
            </label>
            <textarea
              id="body"
              name="body"
              required
              maxLength={500}
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Write something..."
            />
          </div>
        )}

        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-600">Post created successfully.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
