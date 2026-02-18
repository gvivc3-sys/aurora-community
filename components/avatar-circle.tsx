"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const avatars = [
  "/images/avatar_pool/blonde_candid_photo.jpeg",
  "/images/avatar_pool/woman_brunette.jpeg",
  "/images/avatar_pool/woman_dark_hair_smile.jpeg",
  "/images/avatar_pool/long_curly_hair_night.jpeg",
  "/images/avatar_pool/woman_blonde.jpeg",
  "/images/avatar_pool/woman_dark_hair.jpeg",
  "/images/avatar_pool/blonde_woman_candid.jpeg",
  "/images/avatar_pool/woman_brunette_basic.jpeg",
  "/images/avatar_pool/woman_smile_blonde.jpeg",
  "/images/avatar_pool/woman_blonde_2.jpeg",
];

// Pre-compute positions as rounded integers so server and client match exactly
const RADIUS = 280;
const positions = avatars.map((_, i) => {
  const rad = ((i / avatars.length) * 360 * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * RADIUS),
    y: Math.round(Math.sin(rad) * RADIUS),
  };
});

export default function AvatarCircle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const inner = el.querySelector<HTMLDivElement>("[data-tilt-target]");
    if (!inner) return;

    let currentX = 0;
    let currentY = 0;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;

    function onMouseMove(e: MouseEvent) {
      if (isMobile) return;
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tiltRef.current.x = ((e.clientY - cy) / (rect.height / 2)) * -12;
      tiltRef.current.y = ((e.clientX - cx) / (rect.width / 2)) * 12;
    }

    function onMouseLeave() {
      if (isMobile) return;
      tiltRef.current.x = 0;
      tiltRef.current.y = 0;
    }

    function onScroll() {
      if (!isMobile) return;
      const rect = el!.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = (viewH / 2 - rect.top) / (rect.height + viewH);
      tiltRef.current.x = (progress - 0.5) * 30;
      tiltRef.current.y = Math.sin(progress * Math.PI * 2) * 8;
    }

    function animate() {
      currentX += (tiltRef.current.x - currentX) * 0.08;
      currentY += (tiltRef.current.y - currentY) * 0.08;
      inner!.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      rafRef.current = requestAnimationFrame(animate);
    }

    const section = el.closest("section") ?? document;
    section.addEventListener("mousemove", onMouseMove as EventListener);
    section.addEventListener("mouseleave", onMouseLeave as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", onMouseMove as EventListener);
      section.removeEventListener("mouseleave", onMouseLeave as EventListener);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div
        data-tilt-target
        className="relative h-[620px] w-[620px] sm:h-[700px] sm:w-[700px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
          {avatars.map((src, i) => (
            <div
              key={src}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${positions[i].x}px, ${positions[i].y}px)`,
              }}
            >
              <div
                className="h-[88px] w-[88px] overflow-hidden rounded-full shadow-lg blur-[2px] opacity-60 sm:h-20 sm:w-20"
                style={{
                  animation: "spin 30s linear infinite reverse",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  width={88}
                  height={88}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
