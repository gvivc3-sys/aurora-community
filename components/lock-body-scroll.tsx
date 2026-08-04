"use client";

import { useEffect } from "react";

export default function LockBodyScroll() {
  useEffect(() => {
    const { style } = document.body;
    const prev = {
      position: style.position,
      overflow: style.overflow,
      width: style.width,
      height: style.height,
    };

    style.position = "fixed";
    style.overflow = "hidden";
    style.width = "100%";
    style.height = "100%";

    return () => {
      style.position = prev.position;
      style.overflow = prev.overflow;
      style.width = prev.width;
      style.height = prev.height;
    };
  }, []);

  return null;
}
