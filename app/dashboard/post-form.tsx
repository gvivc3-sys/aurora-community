"use client";

import { useActionState, useState, useRef, useEffect, useCallback } from "react";
import { createPost } from "@/lib/actions/post";
import RichTextEditor from "@/components/rich-text-editor";
import AudioPlayer from "@/components/audio-player";
import { useToast } from "@/components/toast";

const postTypes = [
  { key: "voice", label: "Voice" },
  { key: "video", label: "Video" },
  { key: "text", label: "Text" },
  { key: "article", label: "Article" },
] as const;

const tags = [
  { key: "love", label: "Love", emoji: "\u2764\uFE0F", color: "border-pink-300 bg-pink-50 text-pink-700", activeColor: "border-pink-500 bg-pink-100 text-pink-800 ring-2 ring-pink-200" },
  { key: "health", label: "Health", emoji: "\uD83C\uDF3F", color: "border-green-300 bg-green-50 text-green-700", activeColor: "border-green-500 bg-green-100 text-green-800 ring-2 ring-green-200" },
  { key: "magic", label: "Magic", emoji: "\u2728", color: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700", activeColor: "border-fuchsia-500 bg-fuchsia-100 text-fuchsia-800 ring-2 ring-fuchsia-200" },
] as const;

type PostType = (typeof postTypes)[number]["key"];
type Tag = (typeof tags)[number]["key"];

function RecordingVisualizer({ stream }: { stream: MediaStream }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);

      const barW = 3 * dpr;
      const gap = 2 * dpr;
      const bars = Math.floor(w / (barW + gap));
      const step = Math.max(1, Math.floor(bufferLength / bars));

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step] || 0;
        const barH = Math.max(2 * dpr, (value / 255) * h * 0.85);
        const x = i * (barW + gap);
        const y = (h - barH) / 2;

        ctx.fillStyle = `rgba(92, 80, 64, ${0.3 + (value / 255) * 0.7})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 1.5 * dpr);
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      audioCtx.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      className="h-12 w-full rounded-lg bg-warm-50"
    />
  );
}

export default function PostForm() {
  const { toast } = useToast();
  const [state, formAction, pending] = useActionState(createPost, null);
  const [type, setType] = useState<PostType>("voice");
  const [tag, setTag] = useState<Tag>("love");
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [editorKey, setEditorKey] = useState(0);
  const [textCharCount, setTextCharCount] = useState(0);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<{url: string, name: string, type: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview.url);
    };
  }, [filePreview]);

  useEffect(() => {
    if (state?.error) {
      toast(state.error, "error");
    } else if (state?.success) {
      toast("Post created successfully.", "success");
    }
  }, [state, toast]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
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
        streamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast("Could not access microphone. Please allow microphone access.", "error");
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
      toast("Please select an audio file.", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("Audio file must be under 10 MB.", "error");
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
    if (filePreview) {
      URL.revokeObjectURL(filePreview.url);
      setFilePreview(null);
      setAttachedFile(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (type === "text" && attachedFile) {
      formData.set("file", attachedFile);
    }
    formAction(formData);
  }

  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full bg-warm-800 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
      >
        {open ? "Cancel" : "+ New Post"}
      </button>

      {open && (
      <div className="mt-4 rounded-2xl border border-warm-200 bg-white p-4 shadow-sm sm:p-6">
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
                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 text-xs font-medium text-white shadow-md transition-all hover:from-red-400 hover:to-red-500 hover:shadow-lg active:scale-[0.98] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                    </svg>
                    Record
                  </button>
                  <span className="text-xs text-warm-400 sm:text-sm">or</span>
                  <label className="cursor-pointer rounded-full border border-warm-300 px-3 py-2 text-xs font-medium text-warm-600 shadow-sm transition-all hover:border-warm-400 hover:bg-warm-50 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm">
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                      </span>
                      <span className="text-sm font-medium text-warm-700">
                        Recording {formatDuration(duration)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center gap-2 rounded-full bg-warm-800 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                      </svg>
                      Stop
                    </button>
                  </div>
                  {streamRef.current && <RecordingVisualizer stream={streamRef.current} />}
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
            <div>
              <label className="mb-1 block text-sm font-medium text-warm-700">
                Description{" "}
                <span className="font-normal text-warm-400">(optional)</span>
              </label>
              <textarea
                name="body"
                maxLength={500}
                rows={2}
                placeholder="Add context to your voice note..."
                className="block w-full resize-none rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 shadow-sm focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
              />
            </div>
          </>
        )}

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
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-warm-700">
                What&apos;s on your mind?
              </label>
              <RichTextEditor
                key={editorKey}
                name="body"
                placeholder="Write something..."
                minHeight="4rem"
                onCharCount={setTextCharCount}
              />
              <p className={`mt-1 text-xs ${textCharCount > 300 ? "font-medium text-red-500" : "text-warm-400"}`}>
                {textCharCount}/300 characters
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-warm-700">
                Attachment{" "}
                <span className="font-normal text-warm-400">(optional)</span>
              </label>
              {!filePreview ? (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-warm-300 px-3 py-2 text-xs font-medium text-warm-600 shadow-sm transition-all hover:border-warm-400 hover:bg-warm-50 hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
                  </svg>
                  Attach file
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
                        toast("Only image and PDF files are allowed.", "error");
                        e.target.value = "";
                        return;
                      }
                      if (f.size > 10 * 1024 * 1024) {
                        toast("File must be under 10 MB.", "error");
                        e.target.value = "";
                        return;
                      }
                      setAttachedFile(f);
                      setFilePreview({ url: URL.createObjectURL(f), name: f.name, type: f.type });
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-warm-200 bg-warm-50 p-3">
                  {filePreview.type.startsWith("image/") ? (
                    <img
                      src={filePreview.url}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-warm-200">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-warm-500">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-warm-700">{filePreview.name}</p>
                    <p className="text-xs text-warm-400">{filePreview.type.startsWith("image/") ? "Image" : "PDF"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(filePreview.url);
                      setFilePreview(null);
                      setAttachedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-warm-400 hover:text-warm-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </>
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

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-warm-800 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? "Posting..." : "Publish"}
        </button>
      </form>
      </div>
      )}
    </div>

  );
}
