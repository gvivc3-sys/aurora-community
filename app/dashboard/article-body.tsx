"use client";

import { useState } from "react";
import PostAttachment from "@/components/post-attachment";

export default function ArticleBody({
  title,
  body,
  fileUrl,
  fileType,
  collapsible = true,
}: {
  title: string | null;
  body: string;
  fileUrl?: string | null;
  fileType?: string | null;
  collapsible?: boolean;
}) {
  const [expandedState, setExpandedState] = useState(false);
  const expanded = !collapsible || expandedState;

  return (
    <div className="mt-3 px-4">
      {fileUrl && (
        <div className="-mx-4 mb-3">
          <PostAttachment fileUrl={fileUrl} fileType={fileType ?? null} variant="thumbnail" expanded={expanded} />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-warm-900">{title}</h3>
      )}
      <div
        className={`prose prose-sm prose-zinc relative mt-1 max-w-none overflow-hidden transition-[max-height] duration-300 ${
          expanded ? "max-h-[none]" : "max-h-48"
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: body }} />
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpandedState(!expandedState)}
          className="mt-1 text-sm font-medium text-warm-500 hover:text-warm-700"
        >
          {expandedState ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
