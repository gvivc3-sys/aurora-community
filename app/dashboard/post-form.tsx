"use client";

import { useActionState, useState, useRef, useEffect, useCallback } from "react";
import { createPost } from "@/lib/actions/post";
import RichTextEditor from "@/components/rich-text-editor";
import AudioPlayer from "@/components/audio-player";

const postTypes = [
  { key: "video", label: "Video" },
  { key: "text", label: "Text" },
  { key: "article", label: "Article" },
  { key: "voice", label: "Voice" },
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

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("Could not access microphone. Please allow microphone access.");
    }
  }, []);

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function clearRecording() {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setDuration(0);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Audio file must be under 10 MB.");
      return;
    }
    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioPreviewUrl(url);
  }

  function handleTypeChange(newType: PostType) {
    setType(newType);
    setEditorKey((k) => k + 1);
    if (newType !== "voice") {
      clearRecording();
    }
  }

  function formatDuration(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  async function handleSubmit(formData: FormData) {
    if (type === "voice" && audioBlob) {
      const ext = audioBlob instanceof File ? (audioBlob.name.split(".").pop() || "webm") : "webm";
      formData.set("audio", new File([audioBlob], `recording.${ext}`, { type: audioBlob.type }));
    }
    formAction(formData);
  }

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-light tracking-tight text-warm-900">Create a Post</h2>

      {/* Post type — tab-style underline selector */}
      <div className="mt-3 flex border-b border-warm-200 sm:mt-4">
        {postTypes.map((pt) => (
          <button
            key={pt.key}
            type="button"
            onClick={() => handleTypeChange(pt.key)}
            className={`flex-1 px-2 py-2 text-center text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm ${
              type === pt.key
                ? "border-b-2 border-warm-900 text-warm-900"
                : "text-warm-400 hover:text-warm-600"
            }`}
          >
            {pt.label}
          </button>
        ))}
      </div>

      <form action={handleSubmit} className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="tag" value={tag} />
        <input
          type="hidden"
          name="comments_enabled"
          value={commentsEnabled ? "on" : ""}
        />

        {/* Tag selector — colored cards with emoji */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700 sm:mb-2">
            Category
          </label>
          <div className="flex gap-2 sm:gap-3">
            {tags.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTag(t.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                  tag === t.key ? t.activeColor : t.color
                }`}
              >
                <span className="text-sm sm:text-base">{t.emoji}</span>
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

        {type === "voice" && (
          <>
            <div>
              <label
                htmlFor="voice_title"
                className="block text-sm font-medium text-warm-700"
              >
                Title{" "}
                <span className="font-normal text-warm-400">(optional)</span>
              </label>
              <input
                id="voice_title"
                name="title"
                type="text"
                maxLength={200}
                className="mt-1 block w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
                placeholder="Voice note title"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-warm-700">
                Audio
              </label>

              {!audioBlob && !recording && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                    </svg>
                    Record
                  </button>
                  <span className="text-xs text-warm-400 sm:text-sm">or</span>
                  <label className="cursor-pointer rounded-full border border-warm-300 px-3 py-2 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-50 sm:px-4 sm:py-2.5 sm:text-sm">
                    Upload file
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {recording && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-warm-700">
                      Recording {formatDuration(duration)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-full bg-warm-900 px-4 py-2.5 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                    </svg>
                    Stop
                  </button>
                </div>
              )}

              {audioBlob && audioPreviewUrl && (
                <div className="space-y-2">
                  <AudioPlayer src={audioPreviewUrl} />
                  <button
                    type="button"
                    onClick={clearRecording}
                    className="text-sm text-warm-500 underline hover:text-warm-700"
                  >
                    Remove and re-record
                  </button>
                </div>
              )}
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
