"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HandleMapping = Record<string, string>; // handle → user_id

/**
 * Renders plaintext with @handle patterns as clickable profile links.
 * Fetches handle→userId mappings on mount for any @mentions found in the text.
 */
export default function MentionText({ text }: { text: string }) {
  const [handleMap, setHandleMap] = useState<HandleMapping>({});

  // Extract all handles from text
  const handles = Array.from(
    new Set(
      Array.from(text.matchAll(/@([a-z][a-z0-9_]{2,19})\b/g)).map((m) => m[1]),
    ),
  );

  useEffect(() => {
    if (handles.length === 0) return;

    async function resolve() {
      const map: HandleMapping = {};
      // Fetch each handle — the search API supports this
      for (const handle of handles) {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(handle)}`);
        if (!res.ok) continue;
        const results = await res.json();
        const exact = results.find(
          (r: { handle: string; user_id: string }) => r.handle === handle,
        );
        if (exact) {
          map[handle] = exact.user_id;
        }
      }
      setHandleMap(map);
    }

    resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Split text into segments: plain text and @mentions
  const parts: { type: "text" | "mention"; value: string; handle?: string }[] = [];
  let lastIndex = 0;
  const regex = /@([a-z][a-z0-9_]{2,19})\b/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "mention", value: match[0], handle: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "mention" && part.handle && handleMap[part.handle]) {
          return (
            <Link
              key={i}
              href={`/profile/${handleMap[part.handle]}`}
              className="font-semibold text-warm-600 hover:underline"
            >
              {part.value}
            </Link>
          );
        }
        return <span key={i}>{part.value}</span>;
      })}
    </>
  );
}
