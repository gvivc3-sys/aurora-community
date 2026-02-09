"use client";

import { useState } from "react";
import Markdown from "react-markdown";

export default function ArticleBody({
  title,
  body,
}: {
  title: string | null;
  body: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-3 px-4">
      {title && (
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      )}
      <div
        className={`prose prose-sm prose-zinc relative mt-1 max-w-none overflow-hidden transition-[max-height] duration-300 ${
          expanded ? "max-h-[none]" : "max-h-32"
        }`}
      >
        <Markdown>{body}</Markdown>
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-sm font-medium text-zinc-500 hover:text-zinc-700"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
