"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const MOBILE_NAV_HEIGHT = 56; // 3.5rem

export default function ChatShell({ children }: { children: ReactNode }) {
  const [mobileStyle, setMobileStyle] = useState<CSSProperties | undefined>(undefined);

  useEffect(() => {
    const vv = window.visualViewport;

    function update() {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop || !vv) {
        setMobileStyle(undefined);
        return;
      }
      // Track the actual visible (visual) viewport rather than the layout
      // viewport, since iOS can pan the page to reveal a focused input
      // without firing a real scroll and without resizing the layout
      // viewport, which would otherwise leave position:fixed elements
      // pinned to the wrong place.
      setMobileStyle({
        top: vv.offsetTop + MOBILE_NAV_HEIGHT,
        height: vv.height - MOBILE_NAV_HEIGHT,
        bottom: "auto",
      });
    }

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      style={mobileStyle}
      className="fixed inset-x-0 bottom-0 top-14 z-10 flex flex-col bg-background md:left-[calc(15rem+max(0px,(100vw-72rem)/2))] md:right-[max(0px,(100vw-72rem)/2)] md:top-0"
    >
      {children}
    </div>
  );
}
