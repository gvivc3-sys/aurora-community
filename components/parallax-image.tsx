"use client";

import { useEffect, useRef, useState } from "react";

export default function ParallaxImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // How far through the viewport the element is (0 = top, 1 = bottom)
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      // Map to a parallax offset range (-30px to +30px)
      setOffset((progress - 0.5) * 60);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ transform: `translateY(${offset}px) scale(1.15)`, willChange: "transform" }}
      />
    </div>
  );
}
