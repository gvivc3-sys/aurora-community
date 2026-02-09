"use client";

import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export default function EmojiPopover({
  onSelect,
}: {
  onSelect: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        title="Emoji"
      >
        <span className="text-lg leading-none">😊</span>
      </button>
      {open && (
        <div className="absolute bottom-full right-0 z-50 mb-1">
          <EmojiPicker
            onEmojiClick={(data: EmojiClickData) => {
              onSelect(data.emoji);
              setOpen(false);
            }}
            width={320}
            height={360}
            skinTonesDisabled
            searchPlaceHolder="Search emoji..."
          />
        </div>
      )}
    </div>
  );
}
