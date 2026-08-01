import { BoltIcon, HeartIcon, LeafIcon, SparklesIcon, UsersIcon } from "@/components/icons";

const items = [
  { icon: BoltIcon, tint: "bg-fuchsia-50 text-fuchsia-600", text: "More energy, less noise" },
  { icon: BoltIcon, tint: "bg-fuchsia-50 text-fuchsia-600", text: "No more doomscrolling" },
  { icon: SparklesIcon, tint: "bg-rose-50 text-rose-500", text: "Weekly voice notes from Ashley" },
  { icon: UsersIcon, tint: "bg-warm-100 text-warm-600", text: "Real women, real conversations" },
  { icon: UsersIcon, tint: "bg-warm-100 text-warm-600", text: "Friends who share your values" },
  { icon: HeartIcon, tint: "bg-rose-50 text-rose-500", text: "A place that feels like home" },
  { icon: LeafIcon, tint: "bg-green-50 text-green-700", text: "Your own private sanctuary" },
  { icon: UsersIcon, tint: "bg-warm-100 text-warm-600", text: "Support that feels like family" },
  { icon: SparklesIcon, tint: "bg-fuchsia-50 text-fuchsia-600", text: "Wisdom shared, week by week" },
  { icon: HeartIcon, tint: "bg-rose-50 text-rose-500", text: "You are not alone here" },
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
    <div className="marquee-fade overflow-hidden">
      <div className="animate-marquee flex w-max gap-4">
        {track.map((item, i) => (
          <MarqueeCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
