"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function PageShell({ isMember, children }: { isMember: boolean; children: ReactNode }) {
  const pathname = usePathname();
  // Mirrors NavInner's showAppChrome: the sidebar (and its reserved space)
  // only applies once a member is inside the app, not on the public
  // landing page.
  const showAppChrome = isMember && pathname !== "/";

  return (
    <div className={showAppChrome ? "md:pl-[calc(15rem+max(0px,(100vw-72rem)/2))] md:pr-[max(0px,(100vw-72rem)/2)]" : ""}>
      {children}
    </div>
  );
}
