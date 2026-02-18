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

export default function AvatarCircle() {
  const count = avatars.length;
  const radius = 280;
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

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Map mouse position to rotation (-12 to 12 degrees)
      tiltRef.current.x = ((e.clientY - cy) / (rect.height / 2)) * -12;
      tiltRef.current.y = ((e.clientX - cx) / (rect.width / 2)) * 12;
    }

    function onMouseLeave() {
      tiltRef.current.x = 0;
      tiltRef.current.y = 0;
    }

    function animate() {
      // Lerp toward target for smooth movement
      currentX += (tiltRef.current.x - currentX) * 0.08;
      currentY += (tiltRef.current.y - currentY) * 0.08;
      inner!.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      rafRef.current = requestAnimationFrame(animate);
    }

    // Listen on the whole hero section (parent) for broader mouse tracking
    const section = el.closest("section") ?? document;
    section.addEventListener("mousemove", onMouseMove as EventListener);
    section.addEventListener("mouseleave", onMouseLeave as EventListener);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("mousemove", onMouseMove as EventListener);
      section.removeEventListener("mouseleave", onMouseLeave as EventListener);
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
          {avatars.map((src, i) => {
            const angle = (i / count) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <div
                key={src}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <div
                  className="h-16 w-16 overflow-hidden rounded-full shadow-lg blur-[2px] opacity-60 sm:h-20 sm:w-20"
                  style={{
                    animation: "spin 30s linear infinite reverse",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
