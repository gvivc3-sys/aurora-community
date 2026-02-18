import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getZodiacSign } from "@/lib/zodiac";
import Avatar from "@/components/avatar";

type Params = Promise<{ userId: string }>;

export default async function PublicProfilePage({
  params,
}: {
  params: Params;
}) {
  const { userId } = await params;

  const supabase = await createClient();
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  if (!viewer) {
    redirect("/login");
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data?.user) {
    notFound();
  }

  const target = data.user;
  const meta = target.user_metadata ?? {};
  const isOwner = viewer.id === target.id;

  const memberSince = new Date(target.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const zodiac = meta.birthday
    ? getZodiacSign(new Date(meta.birthday))
    : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-16">
        {/* Avatar + name + member since */}
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={meta.avatar_url}
            name={meta.username}
            email={target.email}
            size="lg"
          />
          <h1 className="mt-4 text-2xl font-light tracking-tight text-warm-900">
            {meta.username ?? "Anonymous"}
          </h1>
          <p className="mt-1 text-sm text-warm-400">
            Member since {memberSince}
          </p>
        </div>

        {/* Zodiac badge */}
        {zodiac && (
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-warm-100 px-4 py-2 text-sm text-warm-700">
              <span className="text-lg">{zodiac.symbol}</span>{" "}
              <strong>{zodiac.name}</strong> — {zodiac.element} sign
            </div>
          </div>
        )}

        {/* Bio */}
        {meta.bio && (
          <div className="mt-6 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-warm-700">
              {meta.bio}
            </p>
          </div>
        )}

        {/* Telegram */}
        {meta.telegram_handle && (
          <div className="mt-4 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-warm-500">Telegram</h2>
            <a
              href={`https://t.me/${meta.telegram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-warm-700 underline hover:text-warm-900"
            >
              @{meta.telegram_handle}
            </a>
          </div>
        )}

        {/* Owner hint */}
        {isOwner && (
          <div className="mt-6 rounded-2xl border border-warm-200 bg-warm-100 px-4 py-3 text-center">
            <p className="text-sm text-warm-600">
              This is your profile.{" "}
              <Link
                href="/profile"
                className="font-medium underline hover:text-warm-900"
              >
                Edit it here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
