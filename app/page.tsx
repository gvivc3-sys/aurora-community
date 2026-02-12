import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AnimateOnScroll from "@/components/animate-on-scroll";
import WaveformVisual from "@/components/waveform-visual";

/* ── SVG icon components (inline Heroicon-style) ── */

function MicrophoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
    </svg>
  );
}

function VideoCameraIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
    </svg>
  );
}

function DocumentTextIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  );
}

function EnvelopeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
  );
}

function UserGroupIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
      <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
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

function LeafIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
    </svg>
  );
}

const features = [
  {
    icon: <MicrophoneIcon className="h-5 w-5 text-warm-700" />,
    title: "Weekly Voice Notes",
    description:
      "Intimate audio on beauty, health, and feminine living. Press play during your morning ritual or evening wind-down.",
  },
  {
    icon: <VideoCameraIcon className="h-5 w-5 text-warm-700" />,
    title: "Video Guides",
    description:
      "Step-by-step visual guides on rituals, recipes, and routines you can follow along with your sisters.",
  },
  {
    icon: <DocumentTextIcon className="h-5 w-5 text-warm-700" />,
    title: "Long-form Articles",
    description:
      "Deep dives into ancestral wisdom, ingredient breakdowns, and lifestyle philosophy to share and discuss.",
  },
  {
    icon: <EnvelopeIcon className="h-5 w-5 text-warm-700" />,
    title: "Private Messaging",
    description:
      "Send a personal message to the Aurora team. Share what you\u2019re navigating. Every message is read with care.",
  },
  {
    icon: <UserGroupIcon className="h-5 w-5 text-warm-700" />,
    title: "Community Feed",
    description:
      "A quiet, intentional space. No algorithms, no noise \u2014 just women gathering around what matters.",
  },
  {
    icon: <BookmarkIcon className="h-5 w-5 text-warm-700" />,
    title: "Save & Revisit",
    description:
      "Bookmark the content that resonates. Build your personal library of wisdom alongside your sisters.",
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
            A Private Community for Women
          </p>

          <h1
            className="animate-fade-in-up mt-8 text-5xl font-extralight leading-[1.08] tracking-tight text-warm-900 sm:text-6xl md:text-7xl"
            style={{ animationDelay: "150ms" }}
          >
            Find your circle.
            <span className="mt-1 block italic">Return to your nature.</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-warm-500"
            style={{ animationDelay: "300ms" }}
          >
            Aurora is a gathering place for women who are ready to shed the
            modern noise and reconnect &mdash; with themselves, with nature,
            and with each other.
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
                  Join the Sisterhood
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

      {/* ─── WIDE PORTRAIT BANNER ─── */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/portrait_image_wide.jpg"
              alt="Aurora community — women embracing natural beauty"
              width={1200}
              height={500}
              className="h-[280px] w-full object-cover object-top sm:h-[400px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-warm-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-8 pb-8 sm:px-12 sm:pb-12">
              <p className="max-w-md text-lg font-light leading-relaxed text-warm-50 sm:text-xl">
                More than content.
                <span className="mt-1 block font-normal italic">Connection.</span>
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── SISTERHOOD / VOICE NOTES SHOWCASE ─── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-28">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Gather Around
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Wisdom shared,
              <span className="block italic">not preached</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-warm-600">
              Every week, Ashley records raw, honest voice notes on primal
              beauty, ancestral health, and the quiet art of feminine living.
              They&apos;re not lectures &mdash; they&apos;re the kind of
              conversations you&apos;d have with your closest friend over tea.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Press play during your morning ritual. Listen on your walk.
              Share your thoughts in the feed. This is how women have always
              learned &mdash; together, through story and shared experience.
            </p>
            <p className="mt-6 border-l-2 border-warm-300 pl-4 text-sm italic leading-relaxed text-warm-500">
              &ldquo;It feels like sitting in a circle with women who just get
              it. I&apos;ve never felt less alone on this path.&rdquo;
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
                Nourishing your body with the seasons
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
                When we eat with the rhythms of nature, everything shifts
                &mdash; our skin, our energy, the way we carry ourselves&hellip;
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── QUOTE / DARK SECTION ─── */}
      <section className="dark-gradient relative overflow-hidden px-6 py-24 sm:py-32">
        <AnimateOnScroll className="relative mx-auto max-w-3xl text-center">
          <blockquote className="text-2xl font-extralight leading-relaxed tracking-tight text-warm-100 sm:text-3xl md:text-4xl">
            &ldquo;We weren&apos;t meant to figure this out alone.
            <span className="mt-2 block">
              We were meant to walk this path together.&rdquo;
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
            What We Gather Around
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Three pillars of our sisterhood
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-warm-500">
            Everything inside Aurora is rooted in timeless principles that
            women have carried for generations &mdash; now shared and explored
            together.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <AnimateOnScroll delay={0} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-rose-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 transition-transform duration-300 group-hover:scale-110">
                <HeartIcon className="h-6 w-6 text-rose-400" />
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 transition-transform duration-300 group-hover:scale-110">
                <LeafIcon className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Ancestral Health
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Whole foods, seasonal rhythms, and toxin-free living. Reconnect
                with the wisdom your great-grandmother knew by heart &mdash;
                together.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-amber-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 transition-transform duration-300 group-hover:scale-110">
                <SunIcon className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Feminine Energy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Cultivating your natural magnetism through deep rest, nature
                connection, and the quiet confidence that comes from being held
                by a community.
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-100">
                    {feature.icon}
                  </div>
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
              <Image
                src="/images/profile_image_of_ashley.jpg"
                alt="Ashley Aurora"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 320px"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              The Woman Behind Aurora
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              Meet Ashley
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warm-600">
              Ashley has spent years immersed in ancestral beauty practices,
              whole-food nutrition, energy cultivation, and the quiet art of
              feminine living. She spends her days in nature, experimenting with
              traditional recipes, and studying what women throughout history
              have always known.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Aurora was born from something simple: Ashley wanted to bring
              together women who feel the same pull &mdash; back to nature,
              back to simplicity, back to the kind of beauty that doesn&apos;t
              need a filter. Not as a guru with all the answers, but as a
              sister on the same path.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Through weekly voice notes, curated guides, and a deeply
              intentional community, she shares everything she&apos;s learning
              &mdash; so we can all walk this road together.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── COMMUNITY ETHOS STRIP ─── */}
      <section className="border-y border-warm-200 bg-warm-100/60 px-6 py-16 sm:py-20">
        <AnimateOnScroll className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-200/60">
                <UserGroupIcon className="h-5 w-5 text-warm-600" />
              </div>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Private sisterhood
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-200/60">
                <MicrophoneIcon className="h-5 w-5 text-warm-600" />
              </div>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                52+ voice notes a year
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-200/60">
                <SparklesIcon className="h-5 w-5 text-warm-600" />
              </div>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                New content weekly
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-200/60">
                <HeartIcon className="h-5 w-5 text-warm-600" />
              </div>
              <span className="text-xs uppercase tracking-wider text-warm-500">
                Cancel anytime
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
            Your invitation
          </p>
          <h2 className="mt-5 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            You don&apos;t have to walk
            <span className="block italic">this path alone</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-warm-500">
            Join a growing circle of women choosing a more natural, intentional
            way of living. Weekly voice notes, curated guides, private
            messaging, and a community of sisters who understand. All for less
            than a dollar a day.
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
