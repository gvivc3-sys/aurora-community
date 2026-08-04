import type { ReactNode } from "react";

// Covers the entire viewport (the site nav doesn't render on this route —
// see NavInner) so there's exactly one fixed-position element for the
// browser to keep in place, instead of two that can drift out of sync
// while the on-screen keyboard opens or closes.
export default function ChatShell({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-10 flex flex-col bg-background md:left-[calc(15rem+max(0px,(100vw-72rem)/2))] md:right-[max(0px,(100vw-72rem)/2)]">
      {children}
    </div>
  );
}
