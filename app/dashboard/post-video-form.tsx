"use client";

import { useActionState } from "react";
import { postVideo } from "@/lib/actions/video";

export default function PostVideoForm() {
  const [state, formAction, pending] = useActionState(postVideo, null);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Post a Video</h2>
      <form action={formAction} className="mt-4 space-y-4">
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
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="Video title"
          />
        </div>
        <div>
          <label
            htmlFor="vimeo_url"
            className="block text-sm font-medium text-zinc-700"
          >
            Vimeo URL
          </label>
          <input
            id="vimeo_url"
            name="vimeo_url"
            type="url"
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="https://vimeo.com/123456789"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-600">Video posted successfully.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Posting..." : "Post Video"}
        </button>
      </form>
    </div>
  );
}
