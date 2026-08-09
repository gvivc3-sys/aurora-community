import { HeartIcon } from "@/components/icons";
import AnimateOnScroll from "@/components/animate-on-scroll";

const TINT = "bg-warm-100 text-warm-600";

const items = [
  { icon: HeartIcon, tint: TINT, text: "A judgement-free community" },
  { icon: HeartIcon, tint: TINT, text: "Replace doomscrolling with connection" },
  { icon: HeartIcon, tint: TINT, text: "Conversations that actually matter" },
  { icon: HeartIcon, tint: TINT, text: "Grow through shared wisdom" },
  { icon: HeartIcon, tint: TINT, text: "Protect your peace" },
  { icon: HeartIcon, tint: TINT, text: "Friends who share your values" },
  { icon: HeartIcon, tint: TINT, text: "Built on kindness, not comparison" },
  { icon: HeartIcon, tint: TINT, text: "Trade algorithms for authenticity" },
  { icon: HeartIcon, tint: TINT, text: "Support through every season" },
  { icon: HeartIcon, tint: TINT, text: "A calmer corner of the internet" },
  { icon: HeartIcon, tint: TINT, text: "Never navigate life alone" },
];

function MarqueeCard({ item, index }: { item: (typeof items)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <div className="flex w-72 shrink-0 items-center gap-3 rounded-lg border border-warm-200 bg-white px-5 py-4">
      <span className="font-mono text-xs text-warm-300">
        {String((index % items.length) + 1).padStart(2, "0")}
      </span>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.tint}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium text-warm-800">{item.text}</span>
    </div>
  );
}

export default function Marquee() {
  const track = [...items, ...items];
  return (
    <div>
      <AnimateOnScroll className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
          It&apos;s not noise you need.{" "}
          <span className="italic text-fuchsia-600">It&apos;s insight.</span>
        </h2>
      </AnimateOnScroll>
      <div className="marquee-fade mx-auto mt-8 max-w-4xl overflow-hidden px-6">
        <div className="animate-marquee flex w-max gap-4">
          {track.map((item, i) => (
            <MarqueeCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
