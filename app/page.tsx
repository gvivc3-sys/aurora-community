import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AnimateOnScroll from "@/components/animate-on-scroll";
import VideoCard from "@/components/video-card";
import Marquee from "@/components/marquee";
import CommunityMap from "@/components/community-map";
import {
  ArrowRightIcon,
  CheckBadgeAlternateIcon,
  LeafIcon,
  BoltIcon,
  ChatBubbleIcon,
  HeartSolidIcon,
  HeartIcon as OutlineHeartIcon,
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

        <div className="relative mx-auto max-w-4xl px-6 pb-8 pt-8 text-center sm:pb-10 sm:pt-10">
          <div className="relative z-10">
            {/* Headline */}
            <h1
              className="animate-fade-in-up font-display text-4xl leading-[1.05] tracking-tight text-warm-900 sm:text-5xl md:text-6xl"
              style={{ animationDelay: "0ms" }}
            >
              <span className="block font-normal italic">Reclaim your energy.</span>
              <span className="block font-bold">Elevate your life.</span>
            </h1>

            {/* Video */}
            <div className="animate-fade-in-up mx-auto mt-5 max-w-lg" style={{ animationDelay: "150ms" }}>
              <VideoCard src="https://auth.myaurora.io/storage/v1/object/public/videos/placeholder.mp4" poster="/images/portrait_image_wide.jpg" vsl />
            </div>

            {/* CTA buttons */}
            <div
              className="animate-fade-in-up mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: "300ms" }}
            >
              {hasActiveSub ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-warm-800 px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                >
                  Enter the Portal
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href={user ? "/subscribe" : "/signup"}
                    className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100"
                  >
                    Join Aurora
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  {!user && (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-full border border-warm-300 bg-white/60 px-8 py-3.5 text-sm font-medium tracking-wide text-warm-700 shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-[0.98]"
                    >
                      Sign In
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  )}
                </>
              )}
            </div>
            {!hasActiveSub && (
              <p className="animate-fade-in-up mt-4 text-xs text-warm-400" style={{ animationDelay: "450ms" }}>
                <span className="line-through opacity-50">$55</span> $38 / month &middot; Early pricing &middot; Cancel anytime
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE + WHAT IS AURORA ─── */}
      <section className="dark-gradient px-6 py-14 sm:py-20">
        <Marquee dark />
        <AnimateOnScroll className="mx-auto mt-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-50 sm:text-4xl">
            A place to align, connect, and{" "}
            <span className="italic text-fuchsia-300">belong.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-left text-base leading-relaxed text-warm-200 md:text-center">
            Aurora is an <strong className="font-semibold text-warm-50">exclusive</strong>{" "}
            membership and community for women ready to reclaim their energy
            and rise together. It&apos;s a space to align with your highest
            self, connect with sisters who get it, and{" "}
            <strong className="font-semibold text-warm-50">build real friendships</strong>,
            no matter where you live.
          </p>
        </AnimateOnScroll>
      </section>

      {/* ─── GATHER ─── */}
      <section className="border-b border-t border-warm-200 py-12 text-center sm:py-16">
        <AnimateOnScroll className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
            Find your people.<br></br><span className="italic">We call it Gather.</span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150} className="mx-auto mt-8 max-w-4xl px-6">
          <div className="relative rounded-xl border border-warm-200 bg-white p-2 shadow-sm sm:p-4">
            <CommunityMap />

            {/* Callout bubbles — anchored to this card, spilling past its edges */}
            <div
              className="animate-bubble-wiggle-1 pointer-events-none absolute -left-4 top-6 z-20 hidden max-w-[160px] items-center gap-2 rounded-2xl border border-warm-200 bg-white p-2 shadow-lg md:-left-10 md:flex lg:-left-14"
              style={{ animationDelay: "0ms" }}
            >
              <Image
                src="/images/avatar_pool/blonde_woman_candid.jpeg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <p className="text-left text-[11px] font-medium leading-snug text-warm-700">
                Help! New to LA, need friends! 👋😭
              </p>
            </div>

            <div
              className="animate-bubble-wiggle-2 pointer-events-none absolute -left-4 bottom-8 z-20 hidden max-w-[160px] items-center gap-2 rounded-2xl border border-warm-200 bg-white p-2 shadow-lg md:-left-8 md:flex lg:-left-12"
              style={{ animationDelay: "500ms" }}
            >
              <Image
                src="/images/avatar_pool/woman_brunette_basic.jpeg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <p className="text-left text-[11px] font-medium leading-snug text-warm-700">
                New to NYC, who's around? 🤍
              </p>
            </div>

            <div
              className="animate-bubble-wiggle-3 pointer-events-none absolute -right-4 top-1/2 z-20 hidden max-w-[168px] items-center gap-2 rounded-2xl border border-warm-200 bg-white p-2 shadow-lg md:-right-10 md:flex lg:-right-14"
              style={{ animationDelay: "1000ms" }}
            >
              <Image
                src="/images/avatar_pool/woman_dark_hair_smile.jpeg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
              />
              <p className="text-left text-[11px] font-medium leading-snug text-warm-700">
                In Sydney for two weeks, anyone want to grab a coffee? ☕
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={250} className="mx-auto mt-10 max-w-xl px-6">
          <p className="text-left text-base leading-relaxed text-warm-600 md:text-center">
            Every member has her own profile: share your location, your
            IG, and a bit about you. On <strong className="font-semibold text-warm-800">Gather</strong>, let your sisters know
            you&apos;re free to connect: post your city and what you&apos;re
            up for, then message each other directly inside the Aurora app and meet up!
          </p>
          <p className="mt-4 text-left text-base leading-relaxed text-warm-600 md:text-center">
            This is a growing network of sisters on the same frequency,
            all focused on the same thing: stepping into a more radiant,
            healthy, and beautiful life. Wherever you are in the world,
            there&apos;s potential to <strong className="font-semibold text-warm-800">find your people.</strong>
          </p>
        </AnimateOnScroll>

        {/* Gather list mockup */}
        <AnimateOnScroll delay={300} className="mx-auto mt-10 max-w-xl px-6">
          <div className="overflow-hidden rounded-xl border border-warm-200 bg-white text-left shadow-sm">
            <div className="flex items-start gap-3 border-b border-warm-100 p-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/images/avatar_pool/woman_smile_blonde.jpeg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1 text-sm font-medium text-warm-900">
                    Heather
                    <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />
                  </p>
                  <span className="shrink-0 rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">
                    Austin, TX
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-warm-700">
                  Just landed, anyone up for a hike this weekend? ⛰️
                </p>
                <span className="mt-3 inline-block rounded-full bg-warm-800 px-4 py-1.5 text-xs font-medium text-white shadow-sm">
                  Message
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/images/avatar_pool/woman_brunette.jpeg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-warm-900">Priya</p>
                  <span className="shrink-0 rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">
                    London, UK
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-warm-700">
                  Who's in Soho? 🙌🥐
                </p>
                <span className="mt-3 inline-block rounded-full bg-warm-800 px-4 py-1.5 text-xs font-medium text-white shadow-sm">
                  Message
                </span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>


      {/* ─── THE PORTAL ─── */}
      <section className="border-t border-warm-200 px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll className="text-center md:text-left">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              This is <span className="italic">the Portal.</span>
            </h2>
            <p className="mt-6 text-left text-base leading-relaxed text-warm-600">
              This is where Ashley shares her insights regularly,
              through voice notes, short vlogs, and articles. Join the discussion, or just sit with what resonates.
            </p>
            <p className="mt-4 text-left text-base leading-relaxed text-warm-600">
              Every post inside the Portal lives under one of four topics, so you can find
              exactly what speaks to you:
            </p>

            <div className="mt-6 grid grid-cols-2 justify-items-center gap-1 md:justify-items-start">
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
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Health + Beauty</span>
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
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Frequency</span>
                </span>
              </span>
              <span className="rotate-3 -translate-y-1">
                <span
                  className="animate-float-small flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 shadow-sm md:px-5 md:py-3"
                  style={{ animationDelay: "1200ms" }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 md:h-7 md:w-7">
                    <ChatBubbleIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="text-xs font-medium text-warm-900 md:text-sm">Whisper</span>
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
                  <BoltIcon className="h-3 w-3" /> Frequency
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
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-100 text-[9px] font-semibold text-warm-600">
                    MJ
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
      <section className="dark-gradient relative overflow-hidden px-6 py-16 sm:py-24">
        {/* Rotating logo — decorative background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="animate-float absolute -left-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/20 blur-[100px]" />
          <div
            className="animate-float absolute -right-32 bottom-1/4 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/20 blur-[100px]"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            {/* Copy */}
            <AnimateOnScroll className="text-center md:text-left">
              <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-50 sm:text-4xl">
                Some questions are better <span className="italic text-fuchsia-300">asked with a whisper</span>
              </h2>
              <p className="mt-6 text-left text-base leading-relaxed text-warm-200">
                <strong className="font-semibold text-warm-50">Share</strong> what&apos;s
                on your heart: a question, an intention, or something
                you&apos;ve never said out loud. Ashley reads every whisper
                personally and replies with real insight, exactly as
                privately as you choose. All met with <strong className="font-semibold text-warm-50">judgement-free</strong> understanding.
              </p>

              <ul className="mt-6 space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Public:</strong> Ashley
                    may choose to share your whisper to the Portal with her reply.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Anonymous:</strong> shared
                    the same way, but you&apos;re known as &ldquo;a sister.&rdquo;
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
                  <p className="text-sm leading-relaxed text-warm-200">
                    <strong className="font-semibold text-warm-50">Secret:</strong> stays
                    fully private, just you and Ashley. Perfect for{" "}
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
            <a href="#join" className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100">
              Join Aurora
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </a>
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
              Or start a <span className="italic">discussion.</span>
            </h2>
            <p className="mt-6 text-left text-base leading-relaxed text-warm-600">
            Start a discussion about anything that's on your mind. From wellness and relationships to everyday questions and life's bigger moments,
            every discussion has the <strong className="font-semibold text-warm-800">opportunity to grow</strong> through the voices of women who care.
            The discussions with the most meaningful engagement rise to the top, making it easy to discover wisdom, offer support, and feel part
            of something bigger than yourself.
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
                    Morning routines that actually stick? 🌞
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-warm-600">
                    Curious what everyone&apos;s doing before 9am lately&hellip;
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
                    Post your pets!
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-warm-600">
                    This is my cat Merlin 🥺💖
                  </p>
                  <div className="relative mt-2 h-56 w-full overflow-hidden rounded-lg">
                    <Image
                      src="/images/avatar_pool/woman_with_cat.jpeg"
                      alt="A member with her cat, Merlin"
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
              What Awaits You Inside <span className="italic">Aurora</span>
            </h2>
          </AnimateOnScroll>

          <div className="mt-16">
            <PillarShowcase />
          </div>

          <AnimateOnScroll className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-warm-500">
              Four ways to grow, connect, and be supported by your sisters,
              all inside one membership.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-12 text-center">
            <a href="#join" className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100">
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
            <Image src="/icon-512.png" alt="Aurora app icon" fill className="object-cover" sizes="128px" quality={100} />
          </div>
          <h2 className="mt-5 font-display text-2xl leading-tight tracking-tight text-warm-900 sm:text-3xl">
            Aurora lives right on your <span className="italic">home screen.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-warm-600">
            Install Aurora as an app on your phone in seconds, <strong className="font-semibold text-warm-800">no app store 
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
            Step into <span className="font-medium">Aurora.</span>
            <span className="mt-1 block italic">Your friends are waiting.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-left text-base leading-relaxed text-warm-500 md:text-center">
            Aurora is a sanctuary for women who are ready to step into their most
            radiant, magnetic, and naturally beautiful selves through true health,
            feminine wisdom, and the power of sisters rising together.
          </p>

          <div className="relative mx-auto mt-10 max-w-md">
            <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-fuchsia-300/50 via-pink-200/50 to-fuchsia-400/50 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[20px] bg-gradient-to-br from-fuchsia-300 via-pink-200 to-fuchsia-300 p-[3px] shadow-xl">
              <div id="join" className="rounded-[17px] bg-white px-8 py-10 sm:px-10">
                <h3 className="text-center font-display text-2xl font-medium tracking-tight text-warm-900">
                  Aurora Membership
                </h3>
                <ul className="mt-6 space-y-3 text-left">
                  {[
                    "The Portal: Ashley's articles, voice notes, and community discussion",
                    "Gather: connect with frequency-aligned sisters, wherever you are",
                    "Direct messaging with members around the world",
                    "Discussions: open threads with the whole community",
                    "Private, anonymous Whispers with Ashley",
                    "Ashley's Guides: guides, books, and audio tracks (over $125 in value!)",
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
                      className="block w-full rounded-full bg-warm-800 py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                    >
                      Go to Your Portal
                    </Link>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckBadgeAlternateIcon className="h-3.5 w-3.5" />
                        Special Early Discount
                      </span>
                      <Link
                        href={user ? "/subscribe" : "/signup"}
                        className="cta-gradient-btn block w-full rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100"
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

      {/* ─── ABOUT ASHLEY ─── */}
      <section className="dark-gradient border-t border-warm-200 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-[280px_1fr] md:gap-16">
            <AnimateOnScroll className="mx-auto md:mx-0">
              <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-warm-700 shadow-sm sm:h-72 sm:w-72">
                <Image
                  src="https://cnhcyfqdqfmprarwdhng.supabase.co/storage/v1/object/public/avatars/0f4a6ffc-07d9-4a8e-a8da-1da9b64c90c8/avatar.png?t=1785718694658"
                  alt="Ashley"
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={120} className="text-center md:text-left">
              <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-50 sm:text-4xl">
                The woman behind <span className="italic text-fuchsia-300 block">Aurora.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0">
                Ashley has spent years immersed in ancient beauty practices, deep
                nourishment, and living in alignment with true health,
                creating natural skincare, painting, and connecting to the
                natural ways of living on Earth.
              </p>
              <p className="mx-auto mt-4 max-w-md text-left text-base leading-relaxed text-warm-200 md:mx-0">
                Aurora was born from the knowing that each of us holds the power
                to elevate our energy and create the life we feel called to live.
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-warm-200 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll className="text-center">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Questions?
            </h2>
            <p className="mt-4 text-left text-base leading-relaxed text-warm-600 md:text-center">
              A little more on why women are joining, and exactly what
              you get.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="mt-10">
            <FaqAccordion />
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-10 text-center">
            <a href="#join" className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-700 bg-[length:200%_100%] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:brightness-110 hover:shadow-xl active:scale-[0.97] active:brightness-100">
              Ready to find your people?
              <ArrowRightIcon className="h-4 w-4 -rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-200 bg-background px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <svg className="h-3 w-auto text-warm-400" viewBox="0 0 536.4768 49.36722" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Aurora Circle">
              <path d="M2.87406,11.58147c1.91526-3.71708,4.51704-6.5763,7.8065-8.57913,3.2883-2.00108,6.96232-3.00235,11.02382-3.00235,3.54545,0,6.64874.71561,9.30811,2.14449,2.65938,1.43034,4.78932,3.23186,6.39158,5.40457V.77204h12.09607v47.52701h-12.09607v-6.94894c-1.54466,2.2306-3.67577,4.07488-6.39158,5.53344-2.71698,1.45797-5.84819,2.18754-9.39364,2.18754-4.0039,0-7.65-1.02977-10.9383-3.08874-3.28946-2.05897-5.89124-4.96095-7.8065-8.70712-1.91701-3.74559-2.87406-8.0497-2.87406-12.91116,0-4.80445.95705-9.06434,2.87406-12.78259ZM35.68779,17.02881c-1.14439-2.08689-2.68847-3.68915-4.63224-4.80387-1.94494-1.1153-4.03241-1.67324-6.26242-1.67324-2.2306,0-4.28956.54456-6.1769,1.63019-1.88734,1.08679-3.41804,2.67392-4.58977,4.7614-1.1729,2.08806-1.75876,4.56126-1.75876,7.42078,0,2.8601.58587,5.36181,1.75876,7.5063,1.17173,2.14449,2.71581,3.78922,4.63224,4.93303,1.91585,1.14439,3.95969,1.71571,6.13443,1.71571,2.23001,0,4.31749-.55794,6.26242-1.67324,1.94377-1.1153,3.48785-2.71581,4.63224-4.80387,1.14381-2.08689,1.71629-4.58977,1.71629-7.50688,0-2.91653-.57248-5.41766-1.71629-7.5063Z"/><path d="M102.68887.77204v47.52701h-12.09665v-6.00527c-1.54408,2.05897-3.55999,3.67519-6.04774,4.84692s-5.19018,1.75876-8.10729,1.75876c-3.71824,0-7.00654-.78542-9.86547-2.35917-2.86068-1.57259-5.10466-3.88871-6.73484-6.94894-1.6296-3.05907-2.4447-6.70517-2.4447-10.9383V.77204h12.01054v26.16529c0,3.77468.94367,6.67841,2.83101,8.7077,1.88734,2.03104,4.46119,3.04569,7.72098,3.04569,3.31622,0,5.91917-1.01465,7.8065-3.04569,1.88734-2.0293,2.83101-4.93303,2.83101-8.7077V.77204h12.09665Z"/><path d="M129.15407,2.23031c2.48775-1.42889,5.33272-2.14478,8.53607-2.14478v12.61125h-3.17427c-3.77468,0-6.62023.88724-8.53607,2.65938-1.91643,1.77331-2.87348,4.86147-2.87348,9.26506v23.67784h-12.01054V.77204h12.01054v7.37743c1.54408-2.51568,3.55999-4.48883,6.04774-5.91917Z"/><path d="M151.07256,46.0254c-3.66064-2.0293-6.5347-4.90336-8.6216-8.6216-2.08864-3.71708-3.13121-8.00664-3.13121-12.86869,0-4.8603,1.07225-9.14987,3.21674-12.86811,2.14507-3.71708,5.07498-6.59085,8.79381-8.6216,3.71708-2.02959,7.86294-3.0454,12.43933-3.0454,4.57464,0,8.72108,1.01581,12.43933,3.0454,3.71708,2.03075,6.64874,4.90452,8.79323,8.6216,2.14449,3.71824,3.21732,8.00781,3.21732,12.86811,0,4.86205-1.10192,9.15161-3.30284,12.86869-2.20267,3.71824-5.1768,6.5923-8.92238,8.6216-3.74617,2.03104-7.93508,3.04569-12.5679,3.04569-4.57639,0-8.69432-1.01465-12.3538-3.04569ZM169.56021,37.01749c1.91526-1.0577,3.4448-2.64483,4.58977-4.7614,1.14322-2.11482,1.71571-4.68867,1.71571-7.72098,0-4.51705-1.18744-7.99152-3.55999-10.42283-2.3743-2.43073-5.27628-3.6461-8.7077-3.6461s-6.30548,1.21537-8.62218,3.6461c-2.31612,2.43132-3.47389,5.90579-3.47389,10.42283,0,4.51879,1.1281,7.99326,3.38837,10.42341,2.25852,2.4319,5.10466,3.6461,8.53607,3.6461,2.173,0,4.21684-.52827,6.13385-1.58713Z"/><path d="M211.68148,2.23031c2.48775-1.42889,5.33214-2.14478,8.53607-2.14478v12.61125h-3.17427c-3.77468,0-6.62081.88724-8.53607,2.65938-1.91701,1.77331-2.87406,4.86147-2.87406,9.26506v23.67784h-12.01054V.77204h12.01054v7.37743c1.54408-2.51568,3.55999-4.48883,6.04832-5.91917Z"/><path d="M224.63511,11.58147c1.91526-3.71708,4.51704-6.5763,7.8065-8.57913,3.2883-2.00108,6.96232-3.00235,11.02382-3.00235,3.54545,0,6.64874.71561,9.30811,2.14449,2.65938,1.43034,4.78932,3.23186,6.39158,5.40457V.77204h12.09607v47.52701h-12.09607v-6.94894c-1.54408,2.2306-3.67577,4.07488-6.39158,5.53344-2.71698,1.45797-5.84819,2.18754-9.39364,2.18754-4.0039,0-7.65-1.02977-10.9383-3.08874-3.28946-2.05897-5.89124-4.96095-7.8065-8.70712-1.91701-3.74559-2.87406-8.0497-2.87406-12.91116,0-4.80445.95705-9.06434,2.87406-12.78259ZM257.44884,17.02881c-1.14439-2.08689-2.68847-3.68915-4.63224-4.80387-1.94494-1.1153-4.03241-1.67324-6.26242-1.67324-2.2306,0-4.28956.54456-6.1769,1.63019-1.88734,1.08679-3.41804,2.67392-4.58977,4.7614-1.1729,2.08806-1.75876,4.56126-1.75876,7.42078,0,2.8601.58587,5.36181,1.75876,7.5063,1.17173,2.14449,2.71581,3.78922,4.63224,4.93303,1.91585,1.14439,3.95969,1.71571,6.13443,1.71571,2.23001,0,4.31749-.55794,6.26242-1.67324,1.94377-1.1153,3.48785-2.71581,4.63224-4.80387,1.14381-2.08689,1.71629-4.58977,1.71629-7.50688,0-2.91653-.57248-5.41766-1.71629-7.5063Z"/><path d="M366.90592,25.46466c0-14.21601,10.6928-25.16038,24.72015-25.16038,5.66086,0,10.18967,1.57228,14.97071,5.03195v6.73066h-.06355c-4.27725-4.27725-9.18342-6.35331-14.71849-6.35331-10.75635,0-18.93351,8.36583-18.93351,19.49952,0,10.50478,8.36583,18.68194,18.74483,18.68194,5.53507,0,10.94437-2.39052,14.97071-6.4791h.06289v6.79355c-4.52947,3.39678-9.81298,5.15773-15.22227,5.15773-13.96445,0-24.53147-10.44189-24.53147-23.90256Z"/><path d="M415.9027,1.12187v47.42777h-5.66151V1.12187h5.66151Z"/><path d="M421.87736,1.12187h12.64308c6.54199,0,12.83241,3.8999,12.83241,12.5173,0,8.49161-5.22127,12.26573-12.01417,13.33488l15.72475,21.57559h-7.10735l-14.71915-21.32402c-.62891,0-1.19493,0-1.69806-.06289v21.38691h-5.66151V1.12187ZM430.43186,23.07414c6.35331,0,11.00791-2.38986,11.00791-9.24631,0-5.09484-3.64834-7.92559-8.42872-7.92559h-5.47218v17.10901c.88048.06289,1.88673.06289,2.89299.06289Z"/><path d="M448.16847,25.46466c0-14.21601,10.6928-25.16038,24.72015-25.16038,5.66086,0,10.18967,1.57228,14.97006,5.03195v6.73066h-.06289c-4.27725-4.27725-9.18342-6.35331-14.71849-6.35331-10.75635,0-18.93351,8.36583-18.93351,19.49952,0,10.50478,8.36583,18.68194,18.74483,18.68194,5.53507,0,10.94502-2.39052,14.97006-6.4791h.06355v6.79355c-4.52947,3.39678-9.81298,5.15773-15.22227,5.15773-13.96445,0-24.53147-10.44189-24.53147-23.90256Z"/><path d="M491.50374,1.12187h5.66151v42.39582h12.89465v5.03195h-18.55616V1.12187Z"/><path d="M512.88869,1.12187h23.58811v5.03195h-17.92659v14.65625h17.48636v4.90616h-17.48636v17.80146h17.92659v5.03195h-23.58811V1.12187Z"/><polygon points="328.8528 31.23771 322.15062 24.53553 328.85278 17.83335 325.78573 14.7663 319.08357 21.46848 312.38139 14.76631 309.31432 17.83338 316.01651 24.53556 309.31434 31.23774 312.38139 34.30479 319.08355 27.6026 325.78573 34.30478 328.8528 31.23771"/>
            </svg>
            <p className="text-xs text-warm-400">
              &copy; {new Date().getFullYear()} Circle Communities. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
