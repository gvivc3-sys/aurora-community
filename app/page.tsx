import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { AuroraWordmark } from "@/components/nav-inner";
import AnimateOnScroll from "@/components/animate-on-scroll";
import Marquee from "@/components/marquee";
import {
  ArrowRightIcon,
  CheckBadgeAlternateIcon,
  LeafIcon,
  BoltIcon,
  ChatBubbleIcon,
  HeartSolidIcon,
  HeartIcon as OutlineHeartIcon,
  MapPinIcon,
  BookmarkIcon,
  ArrowTopRightIcon,
} from "@/components/icons";
import FaqAccordion from "@/components/faq-accordion";
import PillarShowcase from "@/components/pillar-showcase";


/* ── SVG icon components (inline Heroicon-style) ── */

function MicrophoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
  );
}

function SparklesIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
    </svg>
  );
}



const ashleysGuides = [
  {
    title: "Warrior Woman Workout Guide & Training Program",
    price: "46",
    description:
      "Build a strong, sculpted physique with training that supports your female physiology: 4 weeks of exact lifting workouts, for 2-4 days a week.",
  },
  {
    title: "Holistic Metabolism Guide",
    price: "27",
    description:
      "A complete holistic guide to building and maintaining a strong, healthy metabolism.",
  },
  {
    title: "Electrical Eating: Your Guide to High Frequency Health",
    price: "61",
    description:
      "Knowledge, wisdom, and a grounded framework for nourishing choices, not a rigid diet: food insights, a full grocery list, and meal and snack ideas for true vitality.",
  },
  {
    title: "Alignment Affirmations Audio Tracks",
    price: "46",
    description:
      "Two spoken affirmation tracks (23 and 68 minutes) to elevate your frequency across health, beauty, wealth, energy, alignment, magnetism, gratitude, relationships, and more.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasActiveSub = false;
  if (user) {
    const appMeta = (user as { app_metadata?: { role?: string; access_granted?: boolean } }).app_metadata;
    if (appMeta?.role === "admin" || appMeta?.access_granted) {
      hasActiveSub = true;
    } else {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();
      hasActiveSub = sub?.status === "active" || sub?.status === "past_due";
    }
  }

  return (
    <div className="bg-background">
      {/* ─── HERO (VSL-LED) ─── */}
      <section className="relative z-10">
        <div className="hero-gradient absolute inset-0" />

        <div className="relative mx-auto max-w-5xl px-6 pb-8 pt-8 sm:pb-10 sm:pt-10">
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-[280px_1fr] md:gap-12">
            {/* Face card */}
            <div className="animate-fade-in-up mx-auto md:mx-0" style={{ animationDelay: "0ms" }}>
              <div className="relative aspect-[4/5] w-56 overflow-hidden rounded-2xl border border-warm-200 shadow-sm sm:w-64 md:w-full">
                <Image
                  src="/images/portrait_image_wide.jpg"
                  alt="Ashley, founder of Aurora"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 280px"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              {/* Headline */}
              <h1
                className="animate-fade-in-up font-display text-3xl leading-[1.1] tracking-tight text-warm-900 sm:text-4xl md:text-5xl"
                style={{ animationDelay: "100ms" }}
              >
                <span className="block font-normal italic">Build and embody strength</span>
                <span className="block font-bold">through nourishment, training, and energy cultivation</span>
              </h1>

              {/* CTA buttons */}
              <div
                className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start"
                style={{ animationDelay: "250ms" }}
              >
                {hasActiveSub ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-lg bg-warm-800 px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                  >
                    Enter Aurora
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href={user ? "/subscribe" : "/signup"}
                      className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]"
                    >
                      Join Aurora
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                    {!user && (
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-lg border border-warm-300 bg-white/60 px-8 py-3.5 text-sm font-medium tracking-wide text-warm-700 shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-[0.98]"
                      >
                        Sign In
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    )}
                  </>
                )}
              </div>
              {!hasActiveSub && (
                <p className="animate-fade-in-up mt-4 text-xs text-warm-400" style={{ animationDelay: "400ms" }}>
                  <span className="line-through opacity-50">$55</span> $38 / month &middot; Founding member pricing &middot; Cancel anytime
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE + WHAT IS AURORA ─── */}
      <section className="px-6 py-14 sm:py-20">
        <Marquee />
        <AnimateOnScroll className="mx-auto mt-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
            Aurora | Warrior Woman
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-left text-base leading-relaxed text-warm-600 md:text-center">
            Aurora is an <strong className="font-semibold text-warm-800">exclusive</strong>{" "}
            membership for women committed to becoming stronger, healthier, and more deeply rooted in themselves. 
            Through my articles, voice notes, guidance, and real conversations, you&apos;ll learn to nourish your body, 
            strengthen your mind, and step into the woman you know you can be.{" "}
            <br></br><strong className="font-semibold text-warm-800">Grow alongside me</strong>,
            and connect with sisters committed to becoming their strongest selves too.
          </p>
        </AnimateOnScroll>
      </section>

      {/* ─── ABOUT ASHLEY ─── */}
      <section className="dark-gradient border-t border-warm-200 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-[280px_1fr] md:gap-16">
            <AnimateOnScroll className="mx-auto md:mx-0">
              <div className="relative aspect-[9/16] w-56 overflow-hidden rounded-2xl border border-warm-700 shadow-sm sm:w-64">
                <video
                  src="/videos/ig_example.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120} className="text-center md:text-left">
              <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-50 sm:text-4xl">
                The woman behind Warrior Woman
              </h2>
              <p className="mx-auto mt-5 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0 md:max-w-none">
                As women, we&apos;re taught that being skinny and small is
                something to strive for. After years in the modeling
                industry, where being skinny was celebrated, I decided to
                prioritize my health and unlearn that belief.
              </p>
              <p className="mx-auto mt-4 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0 md:max-w-none">
                I stopped weighing myself and started focusing on nourishing
                my body and becoming stronger. I lifted weights, gained
                muscle, and started valuing how I FEEL above everything
                else. I had never felt so so incredible and powerful in
                every area of my life.
              </p>
              <p className="mx-auto mt-4 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0 md:max-w-none">
                Recently, I stepped on a scale and saw 170 lbs. And the
                number meant nothing to me. I feel strong, healthy, and
                confident, and that matters so much more than what I weigh.
              </p>
              <p className="mx-auto mt-4 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0 md:max-w-none">
                This is why I have created Warrior Woman. I want to help
                women stop shrinking themselves and discover the strength
                already within to build the health, body, and life they
                truly desire.
              </p>
              <a
                href="#join"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]"
              >
                Join Aurora
                <ArrowRightIcon className="h-4 w-4 rotate-90" />
              </a>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── THE PORTAL ─── */}
      <section className="border-t border-warm-200 px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll className="text-center md:text-left">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              This is <span className="italic">the <span className="text-fuchsia-600">Portal</span>.</span>
            </h2>
            <p className="mt-6 text-left text-base leading-relaxed text-warm-600">
              This is where I share every day practices and my philosophies
              to become stronger physically, mentally, and spiritually.
              Voice notes and blog posts on nourishing the body, building
              muscle, and cultivating your energy. You can join the
              discussion or sit with what resonates.
            </p>
            <p className="mt-4 text-left text-base leading-relaxed text-warm-600">
              I sort every post into one of four topics:
            </p>

            <div className="mt-6 inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-3">
              <span className="rotate-2 translate-y-1">
                <span
                  className="animate-float-small flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 shadow-sm md:px-5 md:py-3"
                  style={{ animationDelay: "0ms" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 md:h-7 md:w-7">
                    <LeafIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Nourishment</span>
                </span>
              </span>
              <span className="-rotate-2 -translate-x-2 translate-y-3">
                <span
                  className="animate-float-small flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 shadow-sm md:px-5 md:py-3"
                  style={{ animationDelay: "400ms" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 md:h-7 md:w-7">
                    <HeartIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Strength Training</span>
                </span>
              </span>
              <span className="-rotate-1 translate-x-2 -translate-y-2">
                <span
                  className="animate-float-small flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 shadow-sm md:px-5 md:py-3"
                  style={{ animationDelay: "800ms" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600 md:h-7 md:w-7">
                    <BoltIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Energy</span>
                </span>
              </span>
              <span className="rotate-3 -translate-y-1">
                <span
                  className="animate-float-small flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 shadow-sm md:px-5 md:py-3"
                  style={{ animationDelay: "1200ms" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 md:h-7 md:w-7">
                    <SparklesIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Beauty</span>
                </span>
              </span>
            </div>
          </AnimateOnScroll>

          {/* Example Portal post */}
          <AnimateOnScroll delay={200}>
            <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image src="https://cnhcyfqdqfmprarwdhng.supabase.co/storage/v1/object/public/avatars/0f4a6ffc-07d9-4a8e-a8da-1da9b64c90c8/avatar.png?t=1785718694658" alt="Ashley" fill className="object-cover" sizes="36px" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-900">Ashley</p>
                    <p className="text-xs text-warm-400">3d ago</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-medium text-fuchsia-600">
                  <BoltIcon className="h-3 w-3" /> Energy
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-warm-900">
                  Why your energy is your most valuable currency
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-warm-600">
                  Most of us were taught to manage our time. Almost none of
                  us were taught to manage our energy, and that&apos;s the
                  real difference between women who burn out and women who
                  bloom... 🌷
                </p>
              </div>
              <div className="mx-4 border-t border-warm-100" />
              <div className="flex items-center gap-4 px-4 py-3 text-xs text-warm-400">
                <span className="flex items-center gap-1">
                  <OutlineHeartIcon className="h-3.5 w-3.5" /> 42
                </span>
                <span className="flex items-center gap-1">
                  <ChatBubbleIcon className="h-3.5 w-3.5" /> 15
                </span>
              </div>
              <div className="space-y-2.5 px-4 pb-4">
                <div className="flex items-start gap-2">
                  <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                    <Image src="/images/avatar_pool/long_curly_hair_night.jpeg" alt="" fill className="object-cover" sizes="24px" />
                  </div>
                  <div>
                    <p className="text-xs"><span className="font-medium text-warm-800">Maya J.</span> <span className="text-warm-400">&middot; 2d ago</span></p>
                    <p className="mt-0.5 text-xs leading-relaxed text-warm-600">This shifted something for me today, thank you for this Ashley! 🤍</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
        </div>
      </section>


      {/* ─── WHISPERS FROM THE PORTAL ─── */}
      <section id="whisper" className="dark-gradient relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            {/* Copy */}
            <AnimateOnScroll className="text-center md:text-left">
              <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-50 sm:text-4xl">
                Some questions are better <span className="italic text-fuchsia-300">asked with a whisper</span>
              </h2>
              <p className="mt-6 text-left text-base leading-relaxed text-warm-200">
                <strong className="font-semibold text-warm-50">Share</strong> what&apos;s
                on your heart: a question, a boundary you&apos;re scared to
                set, or something you&apos;ve never said out loud. I read
                every whisper personally and reply with real insight,
                exactly as privately as you choose. All met with <strong className="font-semibold text-warm-50">judgement-free</strong> understanding.
              </p>

              <ul className="mt-6 space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Public:</strong> I
                    may choose to share your whisper to the Portal with my reply.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Anonymous:</strong> I
                    share it the same way, but you&apos;re known as &ldquo;a sister.&rdquo;
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Secret:</strong> stays
                    fully private, just you and me. Perfect for{" "}
                    <strong className="font-semibold text-warm-50">heavy feelings</strong>{" "}
                    or asking what you&apos;ve never said out loud.
                  </p>
                </li>
              </ul>
            </AnimateOnScroll>

            {/* Single whisper example */}
            <AnimateOnScroll delay={200} className="relative">
              <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-white/20 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
                {/* Ashley header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src="https://cnhcyfqdqfmprarwdhng.supabase.co/storage/v1/object/public/avatars/0f4a6ffc-07d9-4a8e-a8da-1da9b64c90c8/avatar.png?t=1785718694658" alt="Ashley" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-900">Ashley</p>
                      <p className="text-xs text-warm-400">2d ago</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    <ChatBubbleIcon className="h-3 w-3" /> Whisper
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-md bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;I&apos;m struggling bad with food. I&apos;ve been having a hard time looking in the mirror. I&apos;m definitely losing weight... idk I still feel SO bad about myself&hellip; what&apos;s wrong with me??&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    Nothing is wrong with you. Losing weight was never going to fix how you feel about yourself, because that&apos;s inner work, not a body project. You&apos;re allowed to want to feel good in your body while still questioning the voice that says it&apos;s not enough. That voice isn&apos;t the truth, it&apos;s an old pattern we can work on quieting together...
                  </p>
                </div>
                {/* Post footer */}
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="flex items-center gap-1 text-sm">
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    <span className="text-red-500">4</span>
                  </span>
                  <ChatBubbleIcon className="h-5 w-5 text-warm-400" />
                  <MapPinIcon className="h-5 w-5 text-warm-400" />
                  <BookmarkIcon className="h-5 w-5 text-warm-400" />
                  <ArrowTopRightIcon className="h-5 w-5 text-warm-400" />
                </div>
                {/* Divider */}
                <div className="mx-4 border-t border-warm-100" />
                {/* Fake comments */}
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                      <Image src="/images/avatar_pool/blonde_candid_photo.jpeg" alt="" fill className="object-cover" sizes="24px" />
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Sofia Lin</span> <span className="text-warm-400">&middot; 1d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">I felt this. What helped me was hiding the scale for a while, and just focusing on how food made me feel, not how it made me look.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                      <Image src="/images/avatar_pool/woman_dark_hair.jpeg" alt="" fill className="object-cover" sizes="24px" />
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Rina K.</span> <span className="text-warm-400">&middot; 2d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Same here, but lately I've been chatting with more friends and keeping busy, and I although sometimes this comes to mind... I don't spiral about it anymore. ❤️</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll className="mt-12 text-center">
            <a href="#join" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]">
              Join Aurora
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── ASHLEY'S GUIDES ─── */}
      <section className="border-t border-warm-200 px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll className="text-center">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              <span className="italic text-fuchsia-600">Ashley&apos;s Guides</span>, included.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warm-600">
              Real tools for becoming stronger, not another quick fix:
              training programs, nourishment frameworks, and mindset audio.
              Lifetime access to my full library, including every future
              release, free with your membership.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="mt-10">
            <ul className="divide-y divide-warm-200 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
              {ashleysGuides.map((g) => (
                <li key={g.title} className="p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-base font-semibold text-warm-900">{g.title}</h3>
                    <p className="shrink-0 text-sm">
                      <span className="text-warm-400 line-through">${g.price}</span>{" "}
                      <span className="font-medium text-green-700">Free with membership</span>
                    </p>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-warm-600">{g.description}</p>
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── DISCUSSIONS ─── */}
      <section className="border-t border-warm-200 px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll className="text-center md:text-left">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              What&apos;s on your <span className="italic text-fuchsia-600">mind</span> today?
            </h2>
            <p className="mt-6 text-left text-base leading-relaxed text-warm-600">
              I wanted a place for the smaller moments too: open threads
              with the whole community for a win, a question, or something
              you want to talk through out loud. Reply, react, and see
              what other women are working on right now.
            </p>
            <p className="mt-4 text-left text-base leading-relaxed text-warm-600">
              I keep it simple: no algorithm, no performance, just <strong className="font-semibold text-warm-800">real conversation</strong> with
              sisters who are also choosing to get stronger, not smaller.
            </p>
          </AnimateOnScroll>

          {/* Discussions list mockup */}
          <AnimateOnScroll delay={200}>
            <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-warm-100 p-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/images/avatar_pool/woman_blonde.jpeg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-warm-900">
                    Morning routines for a calm nervous system 🌷
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-warm-600">
                    Curious what your morning practices are for staying relaxed and feminine&hellip;
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-warm-400">
                    <span>Sarah</span>
                    <span>&middot;</span>
                    <span>2h ago</span>
                    <span className="ml-auto flex items-center gap-1">
                      <ChatBubbleIcon className="h-3.5 w-3.5" /> 12
                    </span>
                    <span className="flex items-center gap-1">
                      <OutlineHeartIcon className="h-3.5 w-3.5" /> 8
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/images/avatar_pool/woman_blonde_2.jpeg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-warm-900">
                    Post your breakfast ✨
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-warm-600">
                    This is my go to brekky lately! Eggs and sourdough toast with butter
                  </p>
                  <div className="relative mt-2 h-56 w-full overflow-hidden rounded-lg">
                    <Image
                      src="/images/breakfast.jpeg"
                      alt="Eggs and sourdough toast with butter"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-warm-400">
                    <span>Eva</span>
                    <span>&middot;</span>
                    <span>1h ago</span>
                    <span className="ml-auto flex items-center gap-1">
                      <ChatBubbleIcon className="h-3.5 w-3.5" /> 24
                    </span>
                    <span className="flex items-center gap-1">
                      <OutlineHeartIcon className="h-3.5 w-3.5" /> 31
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
        </div>
      </section>


      {/* ─── WHAT'S INSIDE ─── */}
      <section className="border-y border-warm-200 bg-warm-100/40 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              What&apos;s Waiting for You Inside <span className="italic text-fuchsia-600">Aurora</span>?
            </h2>
          </AnimateOnScroll>

          <div className="mt-16">
            <PillarShowcase />
          </div>

          <AnimateOnScroll className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-warm-500">
              Four ways I&apos;ve built for you to grow, connect, and become stronger alongside sisters committed to doing the same.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-12 text-center">
            <a href="#join" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]">
              Join Aurora
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── STAY CONNECTED (APP) ─── */}
      <section className="border-t border-warm-200 px-6 py-14 text-center sm:py-20">
        <AnimateOnScroll className="mx-auto max-w-xl">
          <div className="animate-float-small relative mx-auto h-16 w-16 overflow-hidden rounded-2xl shadow-md">
            {/* Plain img (not next/image) so the ?v= cache-busting query string works without touching images.localPatterns */}
            <img src="/icon-512.png?v=3" alt="Aurora app icon" className="h-full w-full object-cover" />
          </div>
          <h2 className="mt-5 font-display text-2xl leading-tight tracking-tight text-warm-900 sm:text-3xl">
            Aurora lives right on your <span className="italic">home screen.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-warm-600">
            I made sure you can install Aurora as an app on your phone in seconds, <strong className="font-semibold text-warm-800">no app store
            needed</strong>, so you&apos;re always one tap away from staying connected to your sisters.
          </p>
        </AnimateOnScroll>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden px-6 py-20 sm:py-28">
        <div className="hero-gradient absolute inset-0 opacity-50" />
        <div className="animate-float absolute -left-24 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-fuchsia-200/30 blur-[80px]" />
        <div
          className="animate-float absolute -right-24 top-1/3 h-60 w-60 rounded-full bg-fuchsia-200/30 blur-[80px]"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="animate-float absolute left-1/3 top-2/3 h-48 w-48 rounded-full bg-pink-100/25 blur-[100px]"
          style={{ animationDelay: "5s" }}
        />

        <AnimateOnScroll className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-extralight leading-[1.08] tracking-tight text-warm-900 sm:text-5xl">
            <span className="mt-1 block italic">Ready to step into your <span className="text-fuchsia-600">Warrior Woman</span> era?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-left text-base leading-relaxed text-warm-500 md:text-center">
            I built Aurora to be where women learn to nourish their bodies
            without guilt, set boundaries without apology, and build real
            strength, physical, mental, and emotional, alongside sisters
            doing the same. Strong and feminine were never opposites.
          </p>

          <div className="relative mx-auto mt-10 max-w-md">
            <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-teal-300/40 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[20px] bg-teal-300 p-[3px] shadow-xl">
              <div id="join" className="rounded-[17px] bg-white px-8 py-10 sm:px-10">
                <h3 className="text-center font-display text-2xl font-medium tracking-tight text-warm-900">
                  Aurora | Warrior Woman
                </h3>
                <ul className="mt-6 space-y-3 text-left">
                  {[
                    "The Portal: my articles, voice notes, and community discussion",
                    "Private, anonymous Whispers with me",
                    "Ashley's Guides: guides, books, and audio tracks (over $125 in value!)",
                    "Discussions: open threads with the whole community",
                    "Direct messaging with members around the world",
                    "Use Aurora right in your browser, or install it as an app on your phone",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-warm-700">
                      <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-warm-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {hasActiveSub ? (
                    <Link
                      href="/dashboard"
                      className="block w-full rounded-lg bg-warm-800 py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                    >
                      Enter Aurora
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckBadgeAlternateIcon className="h-3.5 w-3.5" />
                        Founding Member Pricing
                      </span>
                      <p className="max-w-xs text-center text-xs leading-relaxed text-warm-500">
                        Aurora is just getting started, and I want the women who join me now to be taken care of for it.
                      </p>
                      <Link
                        href={user ? "/subscribe" : "/signup"}
                        className="block w-full rounded-lg bg-teal-700 py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]"
                      >
                        Join Aurora &middot; <span className="line-through opacity-60">$55</span> $38/month
                      </Link>
                      <p className="text-xs text-warm-400">
                        Cancel anytime. No contracts. No questions asked.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-warm-200 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll className="text-center">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Questions?
            </h2>
            <p className="mt-4 text-left text-base leading-relaxed text-warm-600 md:text-center">
              A little more from me on why women are joining, and exactly
              what you get.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="mt-10">
            <FaqAccordion />
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-10 text-center">
            <a href="#join" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-teal-600 hover:shadow-xl active:scale-[0.97]">
              Begin your Journey
              <ArrowRightIcon className="h-4 w-4 -rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-200 bg-background px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <AuroraWordmark className="text-base" showTagline />
            <p className="text-xs text-warm-400">
              &copy; {new Date().getFullYear()} Circle Communities. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
