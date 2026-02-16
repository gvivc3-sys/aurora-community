import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import TelegramConnect from "@/components/TelegramConnect";

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME ?? "";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client to bypass RLS
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("telegram_user_id")
    .eq("user_id", user.id)
    .single();

  const telegramUserId = sub?.telegram_user_id ?? null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-center font-mono text-sm text-warm-500">
          community chat
        </p>

        {/* Telegram connect card */}
        <div className="mt-8 rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Telegram icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2AABEE]/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-[#2AABEE]"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-light tracking-tight text-warm-900">
              Aurora Chat
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-warm-500">
              Connect with the community in real time through our private
              Telegram group. Share insights, ask questions, and build
              meaningful connections.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-warm-50 p-4 text-center">
              <span className="text-2xl">{"\uD83D\uDD12"}</span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-warm-700">
                Private
              </p>
              <p className="mt-1 text-xs text-warm-500">
                Members-only group
              </p>
            </div>
            <div className="rounded-xl bg-warm-50 p-4 text-center">
              <span className="text-2xl">{"\u26A1"}</span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-warm-700">
                Real-time
              </p>
              <p className="mt-1 text-xs text-warm-500">
                Instant conversations
              </p>
            </div>
            <div className="rounded-xl bg-warm-50 p-4 text-center">
              <span className="text-2xl">{"\uD83C\uDF3F"}</span>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-warm-700">
                Curated
              </p>
              <p className="mt-1 text-xs text-warm-500">
                Focused on wellness
              </p>
            </div>
          </div>

          {/* Telegram connect widget */}
          <div className="mt-8">
            <TelegramConnect
              telegramUserId={telegramUserId}
              botUsername={BOT_USERNAME}
            />
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-warm-700">
            How it works
          </h3>
          <div className="mt-6 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-sm font-medium text-warm-700">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-warm-900">
                  Connect your Telegram account
                </p>
                <p className="mt-0.5 text-sm text-warm-500">
                  Link your Telegram to your Aurora profile with one click.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-sm font-medium text-warm-700">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-warm-900">
                  Join the private group
                </p>
                <p className="mt-0.5 text-sm text-warm-500">
                  Get instant access to the members-only Aurora Telegram group.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-sm font-medium text-warm-700">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-warm-900">
                  Start chatting
                </p>
                <p className="mt-0.5 text-sm text-warm-500">
                  Share, ask, and connect with women on the same path.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
