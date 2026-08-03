"use client";

import { useEffect, useRef } from "react";

export default function ChatScrollAnchor({ messageCount }: { messageCount: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "end" });
  }, [messageCount]);

  return <div ref={ref} />;
}
