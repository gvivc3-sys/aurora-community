import type { ComponentType } from "react";
import { SparklesIcon, VideoCameraIcon, RectangleStackIcon, EnvelopeIcon } from "@/components/icons";
import AnimateOnScroll from "@/components/animate-on-scroll";

type Pillar = {
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: SparklesIcon,
    iconColor: "bg-fuchsia-50 text-fuchsia-600",
    title: "The Portal",
    description:
      "Ashley's insights on nourishment, strength, and mindset, in her own words. Read, reflect, and share how it lands for you.",
  },
  {
    icon: VideoCameraIcon,
    iconColor: "bg-rose-50 text-rose-500",
    title: "Ashley's Guides",
    description:
      "Real tools for becoming stronger, not quick fixes: training programs, nourishment frameworks, and mindset audio (over $125 in value), lifetime access, yours forever.",
  },
  {
    icon: RectangleStackIcon,
    iconColor: "bg-purple-50 text-purple-600",
    title: "Discussions",
    description:
      "Open threads for anything on your mind: a win, a question, a boundary you're learning to hold. See what the community is working through, right now.",
  },
  {
    icon: EnvelopeIcon,
    iconColor: "bg-blue-50 text-blue-600",
    title: "Private Messages",
    description:
      "Connect one-on-one with the sisters you meet along the way. Real conversations, just between the two of you.",
  },
];

export default function PillarShowcase() {
  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {pillars.map((pillar, i) => (
        <AnimateOnScroll key={pillar.title} delay={i * 100}>
          <div className="flex w-full items-center gap-4 rounded-xl border border-warm-200 bg-white p-5 text-left shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${pillar.iconColor}`}>
              <pillar.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-warm-900">{pillar.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-warm-600">{pillar.description}</p>
            </div>
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  );
}
