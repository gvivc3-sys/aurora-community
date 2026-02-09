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
  { key: "love", label: "Love", emoji: "\u2764\uFE0F", color: "border-pink-300 bg-pink-50 text-pink-700", activeColor: "border-pink-500 bg-pink-100 text-pink-800 ring-2 ring-pink-200" },
  { key: "health", label: "Health", emoji: "\uD83C\uDF3F", color: "border-green-300 bg-green-50 text-green-700", activeColor: "border-green-500 bg-green-100 text-green-800 ring-2 ring-green-200" },
  { key: "magic", label: "Magic", emoji: "\u2728", color: "border-purple-300 bg-purple-50 text-purple-700", activeColor: "border-purple-500 bg-purple-100 text-purple-800 ring-2 ring-purple-200" },
] as const;

type PostType = (typeof postTypes)[number]["key"];
type Tag = (typeof tags)[number]["key"];

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, null);
  const [type, setType] = useState<PostType>("video");
  const [tag, setTag] = useState<Tag>("love");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [editorKey, setEditorKey] = useState(0);

  function handleTypeChange(newType: PostType) {
    setType(newType);
    setEditorKey((k) => k + 1);
  }

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-light tracking-tight text-warm-900">Create a Post</h2>

      {/* Post type — tab-style underline selector */}
      <div className="mt-4 flex border-b border-warm-200">
        {postTypes.map((pt) => (
          <button
            key={pt.key}
            type="button"
            onClick={() => handleTypeChange(pt.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              type === pt.key
                ? "border-b-2 border-warm-900 text-warm-900"
                : "text-warm-400 hover:text-warm-600"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-5 space-y-5">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="tag" value={tag} />
        <input
          type="hidden"
          name="comments_enabled"
          value={commentsEnabled ? "on" : ""}
        />

        {/* Tag selector — colored cards with emoji */}
        <div>
          <label className="mb-2 block text-sm font-medium text-warm-700">
            Category
          </label>
          <div className="flex gap-3">
            {tags.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  tag === t.key ? t.activeColor : t.color
                }`}
              >
                <span className="text-base">{t.emoji}</span>
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
                className="block text-sm font-medium text-warm-700"
              >
                Video URL
              </label>
              <input
                id="video_url"
                name="video_url"
                type="url"
                required
                className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
                placeholder="YouTube or Vimeo URL"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-warm-700">
                Description{" "}
                <span className="font-normal text-warm-400">(optional)</span>
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
            <label className="mb-1 block text-sm font-medium text-warm-700">
              What&apos;s on your mind?
            </label>
            <RichTextEditor
              key={editorKey}
              name="body"
              placeholder="Write something..."
              minHeight="4rem"
            />
            <p className="mt-1 text-xs text-warm-400">
              300 character limit for text posts.
            </p>
          </div>
        )}

        {type === "article" && (
          <>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-warm-700"
              >
                Title{" "}
                <span className="font-normal text-warm-400">(optional)</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                maxLength={200}
                className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-warm-700">
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

        {/* Comments toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-warm-700">
            Allow comments
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={commentsEnabled}
            onClick={() => setCommentsEnabled(!commentsEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              commentsEnabled ? "bg-warm-900" : "bg-warm-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
                commentsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-600">Post created successfully.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-warm-900 px-4 py-2.5 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-50"
        >
          {pending ? "Posting..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
