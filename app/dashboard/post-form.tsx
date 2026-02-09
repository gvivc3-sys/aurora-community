"use client";

import { useActionState, useState } from "react";
import { createPost } from "@/lib/actions/post";

const postTypes = [
  { key: "video", label: "Video" },
  { key: "text", label: "Text" },
  { key: "article", label: "Article" },
] as const;

const tags = [
  { key: "love", label: "Love" },
  { key: "health", label: "Health" },
  { key: "magic", label: "Magic" },
] as const;

type PostType = (typeof postTypes)[number]["key"];
type Tag = (typeof tags)[number]["key"];

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, null);
  const [type, setType] = useState<PostType>("video");
  const [tag, setTag] = useState<Tag>("love");

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Create a Post</h2>

      <div className="mt-4 flex gap-2">
        {postTypes.map((pt) => (
          <button
            key={pt.key}
            type="button"
            onClick={() => setType(pt.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              type === pt.key
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="tag" value={tag} />

        <div>
          <label className="block text-sm font-medium text-zinc-700">Tag</label>
          <div className="mt-1 flex gap-2">
            {tags.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  tag === t.key
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {type === "video" && (
          <>
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
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-zinc-700"
              >
                Description{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <textarea
                id="body"
                name="body"
                rows={2}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="Add a description..."
              />
              <p className="mt-1 text-xs text-zinc-400">
                Supports **bold**, *italic*, and [links](url).
              </p>
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
              maxLength={300}
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Write something..."
            />
            <p className="mt-1 text-xs text-zinc-400">
              300 character limit. Supports **bold**, *italic*, and [links](url).
            </p>
          </div>
        )}

        {type === "article" && (
          <>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-700"
              >
                Title{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                maxLength={200}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="Article title"
              />
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-zinc-700"
              >
                Content
              </label>
              <textarea
                id="body"
                name="body"
                required
                rows={8}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                placeholder="Write your article..."
              />
              <p className="mt-1 text-xs text-zinc-400">
                Supports **bold**, *italic*, [links](url), lists, and headings
                (#, ##, ###).
              </p>
            </div>
          </>
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
