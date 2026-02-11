"use client";

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
    <div className="relative rounded-2xl border border-warm-200 bg-gradient-to-br from-white to-warm-50 p-5 shadow-sm">
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
      <p className="mt-1.5 text-sm leading-relaxed text-warm-600">
        This is your community feed. Here you&apos;ll find posts, voice
        notes, and articles from the Aurora team. You can like, comment on,
        and save posts you love. Use the{" "}
        <span className="font-medium">Inbox</span> to send private messages,
        and visit <span className="font-medium">Saved</span> to revisit your
        bookmarked content.
      </p>
    </div>
  );
}
