"use client";

import { useActionState, useState } from "react";
import { createPost } from "@/lib/actions/post";
import RichTextEditor from "@/components/rich-text-editor";

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
  // Key to force re-mount of RichTextEditor when type changes
  const [editorKey, setEditorKey] = useState(0);

  function handleTypeChange(newType: PostType) {
    setType(newType);
    setEditorKey((k) => k + 1);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Create a Post</h2>

      <div className="mt-4 flex gap-2">
        {postTypes.map((pt) => (
          <button
            key={pt.key}
            type="button"
            onClick={() => handleTypeChange(pt.key)}
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
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Description{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <RichTextEditor
                key={editorKey}
                name="body"
                placeholder="Add a description..."
                minHeight="3rem"
              />
            </div>
          </>
        )}

        {type === "text" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              What&apos;s on your mind?
            </label>
            <RichTextEditor
              key={editorKey}
              name="body"
              placeholder="Write something..."
              minHeight="4rem"
            />
            <p className="mt-1 text-xs text-zinc-400">
              300 character limit for text posts.
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
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Content
              </label>
              <RichTextEditor
                key={editorKey}
                name="body"
                placeholder="Write your article..."
                minHeight="10rem"
              />
            </div>
          </>
        )}

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="comments_enabled"
            defaultChecked
            className="rounded border-zinc-300"
          />
          Allow comments
        </label>

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
