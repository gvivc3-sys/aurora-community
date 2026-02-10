import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const pillars = [
  {
    icon: "\uD83C\uDF3F",
    title: "Natural Living",
    description:
      "Reconnect with ancestral wisdom. Learn about whole foods, seasonal rhythms, and toxin-free living rooted in nature.",
  },
  {
    icon: "\u2728",
    title: "Primal Beauty",
    description:
      "Radiance from within. Discover beauty rituals that honour your body\u2019s natural intelligence and timeless femininity.",
  },
  {
    icon: "\u2764\uFE0F",
    title: "Wellness & Vitality",
    description:
      "Nourish body, mind, and spirit. From movement to mindset, cultivate a life of vibrant health and deep self-care.",
  },
];

const values = [
  {
    title: "Curated Content",
    description: "Video guides, articles, and conversations crafted by women who live this path.",
  },
  {
    title: "Intimate Community",
    description: "A quiet, intentional space \u2014 no noise, no algorithms, just real connection.",
  },
  {
    title: "Rooted in Nature",
    description: "Everything we share honours the body\u2019s natural design and the rhythms of the earth.",
  },
  {
    title: "Always Evolving",
    description: "New content weekly. Seasonal guides, live discussions, and member-led sharing.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-warm-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-100/80 to-warm-50" />
        <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center sm:pb-32 sm:pt-28">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            A women&apos;s wellness collective
          </p>
          <h1 className="mt-6 text-4xl font-light leading-tight tracking-tight text-warm-900 sm:text-5xl md:text-6xl">
            Return to what&apos;s
            <span className="block italic">naturally yours</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-warm-600">
            Aurora is a private community for women drawn to primal beauty,
            ancestral health, and intentional living. A space to slow down,
            learn, and bloom.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-warm-900 px-8 py-3 text-sm font-medium tracking-wide text-warm-50 transition-colors hover:bg-warm-800"
              >
                Enter the Community
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-warm-900 px-8 py-3 text-sm font-medium tracking-wide text-warm-50 transition-colors hover:bg-warm-800"
                >
                  Join Aurora
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-warm-300 bg-white/60 px-8 py-3 text-sm font-medium tracking-wide text-warm-700 transition-colors hover:bg-white"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-xs border-t border-warm-200" />

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
          Our Pillars
        </p>
        <h2 className="mt-4 text-center text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
          Three roots, one community
        </h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-warm-200 bg-white/70 p-8 text-center transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{pillar.icon}</span>
              <h3 className="mt-4 text-lg font-medium text-warm-900">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-600">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote / Mission */}
      <section className="bg-warm-900 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="text-2xl font-light leading-relaxed tracking-tight text-warm-100 sm:text-3xl">
            &ldquo;The most radical thing a woman can do is return to her
            nature.&rdquo;
          </blockquote>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-warm-400">
            The Aurora Ethos
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
          Membership
        </p>
        <h2 className="mt-4 text-center text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
          What awaits inside
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {values.map((value, i) => (
            <div
              key={i}
              className="rounded-xl border border-warm-200 bg-white/70 px-6 py-5"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-800">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-warm-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-warm-200 bg-warm-100/60 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            Ready to come home to yourself?
          </h2>
          <p className="mt-4 text-warm-600">
            Join a growing circle of women choosing a more natural, intentional
            way of living.
          </p>
          <div className="mt-8">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block rounded-full bg-warm-900 px-10 py-3.5 text-sm font-medium tracking-wide text-warm-50 transition-colors hover:bg-warm-800"
              >
                Go to Feed
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-block rounded-full bg-warm-900 px-10 py-3.5 text-sm font-medium tracking-wide text-warm-50 transition-colors hover:bg-warm-800"
              >
                Join Aurora &mdash; $27/month
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200 bg-warm-50 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-medium tracking-tight text-warm-700">
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
