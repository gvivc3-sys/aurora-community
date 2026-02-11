import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AnimateOnScroll from "@/components/animate-on-scroll";
import WaveformVisual from "@/components/waveform-visual";

const features = [
  {
    icon: "\uD83C\uDFA4",
    title: "Voice Notes from Ashley",
    description:
      "Weekly intimate audio on beauty, health, and feminine living. Press play and let her guide you.",
  },
  {
    icon: "\uD83C\uDFA5",
    title: "Video Guides",
    description:
      "Step-by-step visual guides on rituals, recipes, and routines you can follow along with.",
  },
  {
    icon: "\uD83D\uDCDD",
    title: "Long-form Articles",
    description:
      "Deep dives into ancestral wisdom, ingredient breakdowns, and lifestyle philosophy.",
  },
  {
    icon: "\uD83D\uDC8C",
    title: "Private Messaging",
    description:
      "Send Ashley a personal message. Share what you\u2019re going through. She reads every one.",
  },
  {
    icon: "\uD83E\uDD0D",
    title: "Community Feed",
    description:
      "A quiet, intentional space. No algorithms, no noise \u2014 just women on the same path.",
  },
  {
    icon: "\uD83D\uDD16",
    title: "Save & Revisit",
    description:
      "Bookmark the content that resonates. Build your personal library of wisdom.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-warm-50">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />

        {/* Decorative blobs */}
        <div className="animate-float absolute -right-20 -top-20 h-[28rem] w-[28rem] rounded-full bg-rose-200/20 blur-3xl" />
        <div
          className="animate-float absolute -bottom-28 -left-28 h-[28rem] w-[28rem] rounded-full bg-amber-200/20 blur-3xl"
          style={{ animationDelay: "3.5s" }}
        />

        <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-24 text-center sm:pb-40 sm:pt-36">
          <p className="animate-fade-in-up font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            By Ashley Aurora
          </p>

          <h1
            className="animate-fade-in-up mt-8 text-5xl font-extralight leading-[1.08] tracking-tight text-warm-900 sm:text-6xl md:text-7xl"
            style={{ animationDelay: "150ms" }}
          >
            Primal beauty
            <span className="mt-1 block italic">begins within</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-warm-500"
            style={{ animationDelay: "300ms" }}
          >
            A private sanctuary for women ready to shed the modern and return to
            something ancient, radiant, and real.
          </p>

          <div
            className="animate-fade-in-up mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "450ms" }}
          >
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-10 py-3.5 text-sm font-medium tracking-wide text-warm-50 shadow-lg transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-xl active:scale-[0.98]"
              >
                Enter the Community
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-10 py-3.5 text-sm font-medium tracking-wide text-warm-50 shadow-lg transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-xl active:scale-[0.98]"
                >
                  Begin Your Journey
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-warm-300 bg-white/60 px-8 py-3.5 text-sm font-medium tracking-wide text-warm-700 shadow-sm transition-all hover:bg-white hover:shadow-md active:scale-[0.98]"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Thin separator */}
      <div className="mx-auto w-12 border-t border-warm-300/50" />

      {/* ─── VOICE NOTES SHOWCASE ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-36">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              The Aurora Experience
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Her voice in
              <span className="block italic">your morning</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-warm-600">
              Ashley&apos;s voice notes aren&apos;t content &mdash;
              they&apos;re conversations. Raw, intimate guidance on primal
              beauty, ancestral health, and feminine power delivered straight to
              your feed.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Press play while you do your morning ritual. Listen on your walk.
              Let her words settle in while you rest. This is beauty wisdom that
              lives in the body, not just the mind.
            </p>
            <p className="mt-6 border-l-2 border-warm-300 pl-4 text-sm italic leading-relaxed text-warm-500">
              &ldquo;It&apos;s like having a wise older sister who just gets it.
              I listen every single morning.&rdquo;
            </p>
          </AnimateOnScroll>

          {/* Voice note mockup card */}
          <AnimateOnScroll delay={200}>
            <div className="animate-float rounded-2xl border border-warm-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-amber-200 text-sm font-semibold text-warm-700">
                  AA
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-900">
                    Ashley Aurora
                  </p>
                  <p className="text-xs text-warm-400">
                    Voice Note &middot; 4:32
                  </p>
                </div>
              </div>

              <h3 className="mt-5 text-base font-medium text-warm-900">
                Your morning beauty ritual
              </h3>

              <div className="mt-4 rounded-xl bg-warm-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-warm-800 to-warm-900 text-warm-50 shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-0.5 h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <WaveformVisual />
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-warm-500">
                The simplest shift in how you start your day that changes
                everything about how you carry yourself&hellip;
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── QUOTE / DARK SECTION ─── */}
      <section className="dark-gradient relative overflow-hidden px-6 py-24 sm:py-32">
        <AnimateOnScroll className="relative mx-auto max-w-3xl text-center">
          <blockquote className="text-2xl font-extralight leading-relaxed tracking-tight text-warm-100 sm:text-3xl md:text-4xl">
            &ldquo;The most magnetic woman in the room isn&apos;t performing
            beauty.
            <span className="mt-2 block">
              She&apos;s returned to it.&rdquo;
            </span>
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-warm-600" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-500">
              Ashley Aurora
            </p>
            <div className="h-px w-8 bg-warm-600" />
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-36">
        <AnimateOnScroll className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            The Three Pillars
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Ancient wisdom, modern woman
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-warm-500">
            Everything inside Aurora is rooted in three timeless principles that
            guide women back to their nature.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <AnimateOnScroll delay={0} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-rose-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                {"\u2764\uFE0F"}
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Primal Beauty
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Radiance that can&apos;t be bought in a bottle. Skin rituals,
                hair care, and beauty practices that honour your body&apos;s
                natural intelligence.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-green-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                {"\uD83C\uDF3F"}
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Ancestral Health
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Whole foods, seasonal rhythms, and toxin-free living. Reconnect
                with the wisdom your great-grandmother knew by heart.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-purple-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                {"\u2728"}
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Feminine Power
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Beyond wellness &mdash; a reclamation. Cultivate the magnetic
                energy, deep rest, and quiet confidence that is your birthright.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="border-y border-warm-200 bg-warm-100/40 px-6 py-24 sm:py-36">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Membership
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              What awaits inside
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <div className="h-full rounded-xl border border-warm-200 bg-white/80 px-6 py-5 transition-all duration-300 hover:shadow-md">
                  <span className="text-xl">{feature.icon}</span>
                  <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider text-warm-800">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-600">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ASHLEY ─── */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-36">
        <div className="grid items-center gap-12 md:grid-cols-5">
          <AnimateOnScroll className="md:col-span-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/80 via-amber-100/60 to-warm-200/80" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <p className="animate-shimmer text-lg font-light tracking-widest">
                  ASHLEY AURORA
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Your Guide
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              Meet Ashley Aurora
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warm-600">
              Ashley has spent years studying ancestral beauty practices,
              traditional nutrition, and the quiet art of feminine living. She
              doesn&apos;t believe in trends. She believes in what works &mdash;
              what has <em>always</em> worked.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Aurora was born from her desire to gather women who feel the same
              pull &mdash; back to nature, back to simplicity, back to the kind
              of beauty that doesn&apos;t need a filter.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Through weekly voice notes, curated guides, and a deeply
              intentional community, Ashley shares everything she&apos;s learned
              &mdash; not as a guru, but as a woman walking the same path.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="border-y border-warm-200 bg-warm-100/60 px-6 py-16 sm:py-20">
        <AnimateOnScroll className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-extralight text-warm-900">
                52+
              </span>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Voice notes a year
              </span>
            </div>
            <div className="hidden h-10 w-px bg-warm-300 sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-extralight text-warm-900">3</span>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Pillars of wisdom
              </span>
            </div>
            <div className="hidden h-10 w-px bg-warm-300 sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-extralight text-warm-900">1</span>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Private community
              </span>
            </div>
            <div className="hidden h-10 w-px bg-warm-300 sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-extralight text-warm-900">
                &lt;$1
              </span>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Per day
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-40">
        <div className="hero-gradient absolute inset-0 opacity-50" />
        <div className="animate-float absolute -left-24 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-rose-200/30 blur-3xl" />
        <div
          className="animate-float absolute -right-24 top-1/3 h-60 w-60 rounded-full bg-amber-200/30 blur-3xl"
          style={{ animationDelay: "3s" }}
        />

        <AnimateOnScroll className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            This is your invitation
          </p>
          <h2 className="mt-5 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Ready to come home
            <span className="block italic">to yourself?</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-warm-500">
            Join a growing circle of women choosing a more natural, intentional
            way of living. For less than a dollar a day, get direct access to
            Ashley&apos;s voice, her wisdom, and a community that will hold
            space for your transformation.
          </p>
          <div className="mt-10">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-12 py-4 text-sm font-medium tracking-wide text-warm-50 shadow-lg transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-xl active:scale-[0.98]"
              >
                Go to Your Feed
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-block rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-12 py-4 text-sm font-medium tracking-wide text-warm-50 shadow-lg transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-xl active:scale-[0.98]"
                >
                  Join Aurora &mdash; $27/month
                </Link>
                <p className="text-xs text-warm-400">
                  Cancel anytime. No contracts. No questions asked.
                </p>
              </div>
            )}
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-200 bg-warm-50 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-light tracking-tight text-warm-700">
            Aurora Community
          </p>
          <p className="text-xs text-warm-400">
            &copy; {new Date().getFullYear()} Aurora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
