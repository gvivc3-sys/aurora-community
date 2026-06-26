import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AnimateOnScroll from "@/components/animate-on-scroll";
import WaveformVisual from "@/components/waveform-visual";
import AvatarCircle from "@/components/avatar-circle";
import VideoCard from "@/components/video-card";
import { SparklesIcon as StreamlineSparklesIcon, UsersIcon, VideoCameraIcon, ArrowRightIcon, CheckBadgeAlternateIcon, LeafIcon, BoltIcon } from "@/components/icons";


/* ── SVG icon components (inline Heroicon-style) ── */

function MicrophoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
      <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
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



const pillars = [
  {
    icon: StreamlineSparklesIcon,
    iconColor: "bg-fuchsia-50 text-fuchsia-600",
    title: "The Portal",
    description:
      "A curated space of blog posts and articles on the topics that matter most, written by Ashley. Read, reflect, and share your own experiences and thoughts directly with the community.",
  },
  {
    icon: UsersIcon,
    iconColor: "bg-warm-100 text-warm-600",
    title: "Telegram Group",
    description:
      "A private Telegram group of aligned, like-minded women. Share your insights, ask questions, and learn from the real journeys of women who are walking this path alongside you.",
  },
  {
    icon: VideoCameraIcon,
    iconColor: "bg-rose-50 text-rose-500",
    title: "Ashley's Library",

    description:
      "Lifetime access to all of Ashley's guides and books, including every future release, yours forever. From metabolic health and the energetics of food to workout guides and affirmation audio tracks. This is a living and growing library you'll return to again and again.",
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
    <div className="bg-warm-50">
      {/* ─── HERO (VSL-LED) ─── */}
      <section className="relative z-10 overflow-hidden">
        <div className="hero-gradient absolute inset-0" />

        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pb-20 sm:pt-20">
          <div className="relative z-10">
            <p className="animate-fade-in-up font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              A Private Community for Women
            </p>

            {/* Video */}
            <div className="animate-fade-in-up mt-8" style={{ animationDelay: "150ms" }}>
              <VideoCard src="https://auth.myaurora.io/storage/v1/object/public/videos/placeholder.mp4" poster="/images/portrait_image_wide.jpg" vsl />
            </div>

            {/* CTA buttons */}
            <div
              className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
                    className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]"
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


      {/* ─── SISTERHOOD COPY ─── */}
      <section className="relative overflow-x-clip border-b border-t border-warm-200 py-16 text-center sm:py-24">
        {/* Avatar circle — hidden on mobile to prevent horizontal overflow */}
        <div className="hidden sm:block">
          <AvatarCircle />
        </div>

        <AnimateOnScroll className="relative z-10 mx-auto max-w-xl px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            You Are Not Alone
          </p>
          <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight text-warm-900 sm:text-4xl">
            We were never meant to<br className="hidden sm:block" />
            <span className="italic"> walk this path alone.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-warm-600">
            The Aurora Circle is a sanctuary for women who are ready to step into their most
            radiant, magnetic, and naturally beautiful selves - through true health, feminine
            wisdom, and the power of women rising together.
          </p>
          <p className="mt-4 text-base leading-relaxed text-warm-600">
            Healing happens in community. In being truly seen, deeply supported, and surrounded by
            women of the same frequency and the same desire to come home to themselves.
          </p>
          <p className="mt-4 text-base leading-relaxed text-warm-600">
            That&apos;s why The Aurora Circle was created. To bring us together. To love, uplift, and strengthen
            one another within a safe and sacred container.
          </p>
          <p className="mt-5 text-sm font-medium italic text-warm-500">You belong here.</p>
        </AnimateOnScroll>

      </section>


      {/* ─── ABOUT ASHLEY ─── */}
      <section className="relative z-10 px-6 py-24 sm:py-36" style={{ background: "linear-gradient(160deg, #fdf6ee 0%, #f5e9d8 50%, #fdf6ee 100%)" }}>
        <div className="mx-auto max-w-5xl">
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
              The Woman Behind The Aurora Circle
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              Meet <span className="font-medium">Ashley</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warm-600">
              Ashley has spent years immersed in ancient beauty practices, deep
              nourishment, energy cultivation, and living in alignment with true
              health. She spends her days in nature, creating natural skincare and
              beauty products, painting, and connecting to the natural ways of
              living on Earth.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              This is for the woman who is ready to nourish her body, step into
              true health, build a strong and feminine physique, harness her
              life-force energy, and shift into the higher timeline she knows
              she is meant for.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              The Aurora Circle was born from the deep knowing that each of us holds the
              power to elevate our energy and create the life we feel called to
              live. This is a sanctuary where we come together to create powerful
              shifts within a safe, supportive, and nurturing container.
            </p>
          </AnimateOnScroll>
        </div>
        </div>
      </section>


      {/* ─── SISTERHOOD / VOICE NOTES SHOWCASE ─── */}
      <section className="border-t border-warm-200 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Enter The Portal
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Wisdom shared.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-warm-600">
              Every week, Ashley records heart-led voice notes on true health,
              natural beauty, and elevating your energy. These aren&apos;t
              lectures, they&apos;re the kind of conversations you&apos;d
              have with your closest friend over a cup of tea.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Press play during your morning ritual, listen on your walk, and share
              your thoughts in the feed. This is how women have always learned
              through story, shared experience, and the magic of coming
              together.
            </p>
          </AnimateOnScroll>

          {/* Voice note mockup card */}
          <AnimateOnScroll delay={200}>
            <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src="/images/profile_image_of_ashley.jpg" alt="Ashley Aurora" fill className="object-cover" sizes="44px" />
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-200 text-warm-900 shadow-md">
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
                When we eat with the seasons, everything shifts. Our bodies receive
                the quantum information encoded&hellip;
              </p>
            </div>
          </AnimateOnScroll>
        </div>
        </div>
      </section>


      {/* ─── WHISPERS FROM THE PORTAL ─── */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-36">
        {/* Rotating logo — decorative background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="animate-float absolute -left-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/20 blur-[100px]" />
          <div
            className="animate-float absolute -right-32 bottom-1/4 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/20 blur-[100px]"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              The Whisper
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              Some questions are better <span className="font-medium">asked in a whisper</span>
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {/* Card 1 — Anonymous whisper, Ashley responds */}
            <AnimateOnScroll delay={0}>
              <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
                {/* Ashley header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src="/images/profile_image_of_ashley.jpg" alt="Ashley Aurora" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-900">Ashley Aurora</p>
                      <p className="text-xs text-warm-400">2d ago</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <LeafIcon className="h-3 w-3" /> Nourishment
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;I&apos;ve been trying to lose weight for years and feel inflamed and exhausted. It feels like my metabolism is completely broken.&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    I really feel you with this. So many women experience this after years of dieting and restricting food...
                  </p>
                </div>
                {/* Divider */}
                <div className="mx-4 border-t border-warm-100" />
                {/* Fake comments */}
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-100 text-[9px] font-semibold text-warm-600">
                      SL
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Sofia Lin</span> <span className="text-warm-400">&middot; 1d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">This is exactly where I am right now. So relieved to hear I&apos;m not alone in this.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-pink-100 text-[9px] font-semibold text-warm-600">
                      RK
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Rina K.</span> <span className="text-warm-400">&middot; 2d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Years of yo-yo dieting left me feeling the same way. Ashley&apos;s approach completely changed things for me.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Card 2 — Anonymous whisper, Ashley responds */}
            <AnimateOnScroll delay={150}>
              <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
                {/* Ashley header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src="/images/profile_image_of_ashley.jpg" alt="Ashley Aurora" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-900">Ashley Aurora</p>
                      <p className="text-xs text-warm-400">5d ago</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-medium text-fuchsia-700">
                    <BoltIcon className="h-3 w-3" /> Frequency
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;I want to shift my wardrobe to natural materials but I&apos;m on a tight budget. Is it actually possible?&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    That is amazing to hear and it is 100% possible! A few great places to start are local thrift stores and op shops. So many of my staple pieces are from...
                  </p>
                </div>
                {/* Divider */}
                <div className="mx-4 border-t border-warm-100" />
                {/* Fake comments */}
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-fuchsia-100 text-[9px] font-semibold text-warm-600">
                      JM
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Jasmine M.</span> <span className="text-warm-400">&middot; 4d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">I started at my local op shop last month — found the most beautiful linen pieces for almost nothing!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-200 to-emerald-100 text-[9px] font-semibold text-warm-600">
                      NW
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Nadia W.</span> <span className="text-warm-400">&middot; 5d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Slow fashion is so worth it. My wardrobe feels so much more intentional now.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Card 3 — Named whisper (Elena), Ashley responds */}
            <AnimateOnScroll delay={300}>
              <div className="overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
                {/* Ashley header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src="/images/profile_image_of_ashley.jpg" alt="Ashley Aurora" fill className="object-cover" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-900">Ashley Aurora</p>
                      <p className="text-xs text-warm-400">1w ago</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                    <HeartIcon className="h-3 w-3" /> Health + Beauty
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;I&apos;ve stopped using harsh cleansers on my skin but I&apos;m not sure what to use instead.&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    So glad you&apos;ve stopped using cleansers that strip the skin&apos;s natural barrier and healthy bacteria. These are actually so important for skin health and that bright glowing complexion...
                  </p>
                </div>
                {/* Divider */}
                <div className="mx-4 border-t border-warm-100" />
                {/* Fake comments */}
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-200 text-[9px] font-semibold text-warm-700">
                      EM
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Elena Morales</span> <span className="text-warm-400">&middot; 6d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Same! I switched to just water and a soft cloth and my skin has never looked better.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-blue-100 text-[9px] font-semibold text-warm-600">
                      DT
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Diana T.</span> <span className="text-warm-400">&middot; 5d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">The microbiome angle blew my mind. Makes so much sense now.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll className="mt-12 text-center">
            <a href="#join" className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]">
              Join The Aurora Circle
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>



      {/* ─── QUOTE / DARK SECTION ─── */}
      <section className="dark-gradient relative overflow-hidden px-6 py-24 sm:py-32">
        <AnimateOnScroll className="relative mx-auto max-w-3xl text-center">
          <blockquote className="text-2xl font-extralight leading-relaxed tracking-tight text-warm-100 sm:text-3xl md:text-4xl">
            &ldquo;We were never meant to walk this path alone.
            <span className="mt-2 block">
              Real healing happens in community in the warmth of relating,
              connection, and in the quiet magic of being truly seen.&rdquo;
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

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="border-y border-warm-200 bg-warm-100/40 px-6 py-24 sm:py-36">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Welcome Home
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              What Awaits You Inside the <span className="font-medium">Aurora Circle</span>
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <AnimateOnScroll key={i} delay={i * 120}>
                <div className="h-full rounded-2xl border border-warm-200 bg-white/80 p-8 text-center transition-all duration-300 hover:shadow-lg">
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${pillar.iconColor}`}>
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-warm-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-600">
                    {pillar.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll className="mt-12 text-center">
            <a href="#join" className="cta-gradient-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-8 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]">
              Join The Aurora Circle
              <ArrowRightIcon className="h-4 w-4 rotate-90" />
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── TELEGRAM GROUP ─── */}
      <section className="mx-auto max-w-3xl px-6 py-24 sm:py-36">
        <AnimateOnScroll className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#2AABEE] shadow-sm" style={{ animation: "wiggle 15s ease-in-out infinite" }}>
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            Stay Connected
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            A private group, <span className="italic">just for <span className="font-medium">us</span></span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warm-600">
            Every Aurora member gets access to our private Telegram group. This is
            a space for real-time conversations, shared discoveries, and the kind
            of conversations that make you feel supported and seen on your path.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-warm-600">
            Share your favorite breakfast recipe. A nighttime ritual that helps
            you sleep. A lifestyle shift that elevated your energy. Here you can
            connect with women of the same frequency.
          </p>
        </AnimateOnScroll>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden px-6 py-28 sm:py-40">
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
          <h2 className="text-4xl font-extralight leading-[1.08] tracking-tight text-warm-900 sm:text-5xl">
            Reclaim your <span className="font-medium">energy.</span>
            <span className="mt-1 block italic">Elevate your <span className="font-medium">life.</span></span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warm-500">
            The Aurora Circle is a sanctuary for women who are ready to step into their most
            radiant, magnetic, and naturally beautiful selves through true health,
            feminine wisdom, and the power of women rising together.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-warm-500">
            We were never meant to walk this path alone.
          </p>
          <div id="join" className="mx-auto mt-10 max-w-sm rounded-2xl border border-warm-200 bg-white/80 px-8 py-8 shadow-md">
            <div className="mb-4 flex justify-center">
              <span className="rounded-full bg-rose-50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-rose-500">Special Early Discount</span>
            </div>
            <div className="mb-5 flex justify-center">
              <Image src="/logo.svg" alt="Aurora" width={36} height={40} className="opacity-80" />
            </div>
            <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-warm-400">Everything inside</p>
            <ul className="space-y-3 text-left">
              {[
                "Weekly voice notes from Ashley",
                "Ashley's Library — guides, books, and audio tracks (over $125 in value!)",
                "The Portal — exclusive articles, reflections, and community connection",
                "Private Telegram community",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-warm-700">
                  <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-warm-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {hasActiveSub ? (
                <Link
                  href="/dashboard"
                  className="block w-full rounded-full bg-warm-800 py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
                >
                  Go to Your Portal
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Link
                    href={user ? "/subscribe" : "/signup"}
                    className="cta-gradient-btn block w-full rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] py-3.5 text-center text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]"
                  >
                    Join Aurora &mdash; <span className="line-through opacity-60">$55</span> $38/month
                  </Link>
                  <p className="text-xs text-warm-400">
                    Cancel anytime. No contracts. No questions asked.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-warm-200 bg-warm-50 px-6 py-10">
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
