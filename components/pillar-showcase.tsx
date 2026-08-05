"use client";

import { useEffect, useState, type ComponentType } from "react";
import { SparklesIcon, VideoCameraIcon, RectangleStackIcon } from "@/components/icons";

function UserGroupIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
      <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
    </svg>
  );
}

type Pillar = {
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: UserGroupIcon,
    iconColor: "bg-amber-50 text-amber-600",
    title: "Gather",
    description:
      "Connect with sisters across the world: share where you are, flag when you're free, and message each other directly. No matter your time zone, you're never far from your people.",
  },
  {
    icon: SparklesIcon,
    iconColor: "bg-fuchsia-50 text-fuchsia-600",
    title: "The Portal",
    description:
      "A curated space of blog posts and articles on the topics that matter most, written by Ashley. Read, reflect, and share your own experiences and thoughts directly with the community.",
  },
  {
    icon: RectangleStackIcon,
    iconColor: "bg-purple-50 text-purple-600",
    title: "Conversations",
    description:
      "Open discussion threads on anything on your mind. Reply, react, and see what the community is talking about most, right now.",
  },
  {
    icon: VideoCameraIcon,
    iconColor: "bg-rose-50 text-rose-500",
    title: "Ashley's Guides",
    description:
      "Lifetime access to all of Ashley's guides and books (over $125 in value!), including every future release, yours forever. From metabolic health to workout guides and affirmation audio tracks.",
  },
];

const DURATION_MS = 3500;

export default function PillarShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % pillars.length), DURATION_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <div
      className="mx-auto max-w-2xl space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {pillars.map((pillar, i) => {
        const isActive = i === active;
        return (
          <button
            key={pillar.title}
            type="button"
            onClick={() => setActive(i)}
            className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-500 ${
              isActive
                ? "border-warm-800 bg-white shadow-md"
                : "border-warm-200 bg-white/60 shadow-sm"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 ${pillar.iconColor} ${
                isActive ? "scale-110" : ""
              }`}
            >
              <pillar.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-warm-900">{pillar.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-warm-600">{pillar.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
