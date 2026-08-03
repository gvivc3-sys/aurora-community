"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "aurora-welcome-dismissed";

export default function WelcomeCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative rounded-xl border border-warm-200 bg-gradient-to-br from-white to-warm-50 p-5 shadow-sm">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
      <h3 className="text-base font-medium text-warm-900">
        Welcome to Aurora
      </h3>

      {/* Placeholder for Ashley's welcome video — swap the box below for a
          real <VideoCard src="..." /> once the video is delivered. */}
      <div className="relative mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-warm-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5 text-warm-800">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-warm-200">
            A hello from Ashley &mdash; coming soon
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-warm-600">
        This is your sacred portal. Here you&apos;ll find posts, voice
        notes, and articles from the Aurora team. You can like, comment on,
        and save posts you love. Say hi on{" "}
        <Link href="/frequency" className="font-medium text-warm-900 underline decoration-warm-300 underline-offset-2 transition-colors hover:text-warm-700">Frequency</Link>,
        use{" "}
        <Link href="/inbox" className="font-medium text-warm-900 underline decoration-warm-300 underline-offset-2 transition-colors hover:text-warm-700">Whisper</Link> to
        share something privately with Ashley, and visit{" "}
        <Link href="/bookmarks" className="font-medium text-warm-900 underline decoration-warm-300 underline-offset-2 transition-colors hover:text-warm-700">Saved</Link> to
        revisit your bookmarked content.
      </p>
    </div>
  );
}
