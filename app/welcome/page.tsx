import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CheckBadgeAlternateIcon } from "@/components/icons";
import VideoCard from "@/components/video-card";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-warm-500">
            You&apos;re In
          </p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-warm-900 sm:text-4xl">
            A hello from <span className="font-medium">Ashley</span>
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-lg">
          <VideoCard src="https://auth.myaurora.io/storage/v1/object/public/videos/thankyou.mp4" poster="/images/thankyou_poster.jpg" vsl />
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <p className="text-center text-sm text-warm-500">
            Here&apos;s what&apos;s waiting for you inside:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "The Portal: Ashley's articles, voice notes, and community discussion, organized into Nourishment, Health + Beauty, Frequency, and Whisper.",
              "Gather: post your city and what you're up for, then message other members directly.",
              "Private Messages: your inbox for connecting with members you meet.",
              "Ashley's Guides: her full library of guides, books, and audio tracks.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-warm-700">
                <CheckBadgeAlternateIcon className="mt-0.5 h-4 w-4 shrink-0 text-warm-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-warm-800 to-warm-900 px-10 py-3.5 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98]"
          >
            I&apos;m ready
          </Link>
        </div>
      </div>
    </div>
  );
}
