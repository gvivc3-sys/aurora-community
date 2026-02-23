import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AnimateOnScroll from "@/components/animate-on-scroll";
import WaveformVisual from "@/components/waveform-visual";
import AvatarCircle from "@/components/avatar-circle";


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

function LeafIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
    </svg>
  );
}

const pillars = [
  {
    emoji: "\u2728",
    title: "The Portal",
    description:
      "Daily blog posts and articles, weekly exclusive video content, and a space to send your questions directly \u2014 answered inside the Portal for the whole community to receive.",
  },
  {
    emoji: "\uD83C\uDF00",
    title: "The Circle",
    description:
      "A private Telegram group chat with like-minded, aligned women who are on the same path as you.",
  },
  {
    emoji: "\u26A1",
    title: "Monthly Live Group Call",
    description:
      "A live monthly call with the Aurora community \u2014 connect face-to-face, ask questions in real time, and deepen your sisterhood.",
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

        {/* Decorative gaussian blur blobs */}
        <div className="animate-float absolute -right-20 -top-20 h-[28rem] w-[28rem] rounded-full bg-fuchsia-200/25 blur-[80px]" />
        <div
          className="animate-float absolute -bottom-28 -left-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-200/25 blur-[80px]"
          style={{ animationDelay: "3.5s" }}
        />
        <div
          className="animate-float absolute left-1/2 top-1/4 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-pink-100/30 blur-[100px]"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-24 text-center sm:pb-40 sm:pt-36">
          <AvatarCircle />

          <div className="relative z-10">
            <p className="animate-fade-in-up font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              A Private Community for Women
            </p>

            <h1
              className="animate-fade-in-up mt-8 text-4xl font-extralight leading-[1.08] tracking-tight text-warm-900 sm:text-5xl md:text-6xl"
              style={{ animationDelay: "150ms" }}
            >
              Reclaim your <span className="font-medium">feminine energy.</span>
              <span className="mt-1 block italic">Elevate your <span className="font-medium">life.</span></span>
            </h1>

            <p
              className="animate-fade-in-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-warm-500"
              style={{ animationDelay: "300ms" }}
            >
              Aurora is a sanctuary for women who are ready to step into their
              most magnetic, radiant, and naturally beautiful selves &mdash;
              through holistic health, ancient feminine wisdom, and a community
              of women rising and aligning together.
            </p>

            <div
              className="animate-fade-in-up mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: "450ms" }}
            >
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-warm-800 px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
              >
                Enter the Portal
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="cta-gradient-btn rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]"
                >
                  Enter the Portal
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
              Meet <span className="font-medium">Ashley</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warm-600">
              Ashley has spent years immersed in ancestral beauty practices,
              whole-food nutrition, energy cultivation, and the quiet art of
              feminine living. She spends her days in nature, experimenting with
              traditional recipes, and studying what women throughout history
              have always known.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              This is for the woman who is ready to nourish her body, live
              naturally in alignment with her true health, build a strong and
              feminine physique, harness her life-force energy, and step into
              the frequency of the life she has always known is meant for her.
            </p>
            <p className="mt-4 text-base leading-relaxed text-warm-600">
              Aurora was born from that calling &mdash; a sanctuary where women
              gather to share everything they&apos;re learning, so we can all
              rise together.
            </p>
          </AnimateOnScroll>
        </div>
      </section>


      {/* ─── SISTERHOOD / VOICE NOTES SHOWCASE ─── */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Copy */}
          <AnimateOnScroll>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Gather Around
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-tight text-warm-900 sm:text-4xl">
              Wisdom shared,
              <span className="block italic">not <span className="font-medium">preached</span></span>
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
              &ldquo;It feels like sitting in a portal with women who just get
              it. I&apos;ve never felt less alone on this path.&rdquo;
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9b8e8] text-warm-900 shadow-md">
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


      {/* ─── WHISPERS FROM THE PORTAL ─── */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-36">
        {/* Rotating circles with gaussian blur — decorative background */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="absolute -left-20 top-1/4 h-[32rem] w-[32rem] animate-[spin_30s_linear_infinite] opacity-[0.07]" fill="none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <circle
                key={angle}
                cx={200 + 140 * Math.cos((angle * Math.PI) / 180)}
                cy={200 + 140 * Math.sin((angle * Math.PI) / 180)}
                r={angle % 90 === 0 ? 18 : 12}
                fill="currentColor"
                className="text-warm-800"
              />
            ))}
          </svg>
          <svg viewBox="0 0 400 400" className="absolute -right-16 bottom-1/4 h-[28rem] w-[28rem] animate-[spin_25s_linear_infinite_reverse] opacity-[0.05]" fill="none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <circle
                key={angle}
                cx={200 + 140 * Math.cos((angle * Math.PI) / 180)}
                cy={200 + 140 * Math.sin((angle * Math.PI) / 180)}
                r={angle % 90 === 0 ? 18 : 12}
                fill="currentColor"
                className="text-pink-400"
              />
            ))}
          </svg>
          {/* Gaussian blur blobs */}
          <div className="animate-float absolute -left-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/20 blur-[100px]" />
          <div
            className="animate-float absolute -right-32 bottom-1/4 h-[24rem] w-[24rem] rounded-full bg-fuchsia-200/20 blur-[100px]"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="animate-float absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/15 blur-[80px]"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              The Whisper
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              Your sacred portal should be safe enough to <span className="font-medium">speak freely</span>
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
                  <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700">
                    🤍 whisper
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;How do you stay rooted in your rituals when life gets overwhelming? I keep losing my routine and it feels like I&apos;m starting over every time.&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    You&apos;re not starting over &mdash; you&apos;re returning. That&apos;s different. When everything feels chaotic, come back to the smallest anchor: one glass of warm water in the morning, one minute of stillness. The ritual doesn&apos;t have to be grand to hold you.
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
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Needed this today. Returning, not starting over.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-pink-100 text-[9px] font-semibold text-warm-600">
                      RK
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Rina K.</span> <span className="text-warm-400">&middot; 2d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">The warm water ritual changed my mornings completely.</p>
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
                  <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700">
                    🤍 whisper
                  </span>
                </div>
                {/* Nested anonymous whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <p className="text-xs font-medium text-warm-500">A sister whispered:</p>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;Has anyone else set boundaries with family around the way they eat? I feel so alone in this sometimes.&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    You are not alone in this. Setting boundaries around how you nourish yourself is one of the most courageous acts of self-love. It can feel isolating, but know that this portal is full of women walking the same path &mdash; quietly, bravely.
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
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">I went through the same thing last year. It does get easier.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-200 to-emerald-100 text-[9px] font-semibold text-warm-600">
                      NW
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Nadia W.</span> <span className="text-warm-400">&middot; 5d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">Boundaries are sacred. Thank you for this reminder.</p>
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
                  <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-medium text-pink-700">
                    🤍 whisper
                  </span>
                </div>
                {/* Nested named whisper */}
                <div className="mx-4 mt-3 rounded-lg bg-warm-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-200 text-[8px] font-semibold text-warm-700">
                      EM
                    </div>
                    <p className="text-xs font-medium text-warm-500">Elena Morales asked:</p>
                  </div>
                  <p className="mt-1 text-sm italic text-warm-600">
                    &ldquo;What&apos;s one ancient beauty ritual you think every woman should try at least once?&rdquo;
                  </p>
                </div>
                {/* Ashley's response */}
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed text-warm-700">
                    Oil cleansing. It&apos;s one of the oldest beauty practices in the world &mdash; a revival of ancestral skincare that modern routines forgot. Warm oil, gentle hands, and a moment of intention. Your skin already knows what to do.
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
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">I tried it last night and my skin feels incredible. Thank you!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 to-blue-100 text-[9px] font-semibold text-warm-600">
                      DT
                    </div>
                    <div>
                      <p className="text-xs"><span className="font-medium text-warm-800">Diana T.</span> <span className="text-warm-400">&middot; 5d ago</span></p>
                      <p className="mt-0.5 text-xs leading-relaxed text-warm-600">My grandmother used to do this. Full circle moment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>


      {/* ─── THREE PILLARS ─── */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-36">
        <AnimateOnScroll className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            What We Gather Around
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Three pillars of our <span className="font-medium">sisterhood</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-warm-500">
            Everything inside Aurora is rooted in timeless principles that
            women have carried for generations &mdash; now shared and explored
            together.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <AnimateOnScroll delay={0} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-pink-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-50 transition-transform duration-300 group-hover:scale-110">
                <HeartIcon className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Primal <span className="font-semibold">Beauty</span>
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
                Ancestral <span className="font-semibold">Health</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                Whole foods, seasonal rhythms, and toxin-free living. Reconnect
                with the wisdom your great-grandmother knew by heart &mdash;
                together.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300} className="group">
            <div className="h-full rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-all duration-300 hover:border-fuchsia-200 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 transition-transform duration-300 group-hover:scale-110">
                <SunIcon className="h-6 w-6 text-fuchsia-500" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-warm-900">
                Feminine <span className="font-semibold">Energy</span>
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

      {/* ─── WHAT'S INSIDE ─── */}
      <section className="border-y border-warm-200 bg-warm-100/40 px-6 py-24 sm:py-36">
        <div className="mx-auto max-w-5xl">
          <AnimateOnScroll className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
              Welcome Home ✨
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
              What Awaits You Inside the <span className="font-medium">Aurora Community</span>
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <AnimateOnScroll key={i} delay={i * 120}>
                <div className="h-full rounded-2xl border border-warm-200 bg-white/80 p-8 text-center transition-all duration-300 hover:shadow-lg">
                  <div className="text-4xl">{pillar.emoji}</div>
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
            Every Aurora member gets access to our private Telegram group
            &mdash; a space for real-time conversations, shared discoveries,
            and the kind of daily connection that makes this path feel less
            solitary.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-warm-600">
            Share a recipe that changed your morning. Ask for advice on a
            new ritual. Celebrate the small wins with women who truly
            understand. No algorithms deciding what you see &mdash; just
            honest, unhurried conversation.
          </p>
        </AnimateOnScroll>
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
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            Your invitation
          </p>
          <h2 className="mt-5 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            You don&apos;t have to walk
            <span className="block italic">this path <span className="font-medium">alone</span></span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-warm-500">
            Step into a sanctuary of women reclaiming their feminine energy,
            elevating their health, and rising together &mdash; through the
            Portal, the Circle, monthly live calls, and a sisterhood that
            truly understands.
          </p>
          <div className="mt-10">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block rounded-full bg-warm-800 px-12 py-4 text-sm font-medium tracking-wide text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98]"
              >
                Go to Your Portal
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/signup"
                  className="cta-gradient-btn inline-block rounded-full bg-gradient-to-r from-fuchsia-900 via-pink-700 to-fuchsia-900 bg-[length:200%_100%] px-12 py-4 text-sm font-medium tracking-wide text-white shadow-lg transition-all duration-500 hover:bg-[100%_0] hover:shadow-xl active:scale-[0.97]"
                >
                  Join Aurora &mdash; $55/month
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
          <p className="font-display text-sm font-bold italic tracking-tight text-warm-700">
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
