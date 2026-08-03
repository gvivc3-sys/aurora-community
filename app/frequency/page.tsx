import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveFriendFlags, getMyFriendFlag } from "@/lib/actions/friend-flags";
import BackLink from "@/components/back-link";
import FriendFlagForm from "@/components/friend-flag-form";
import FriendFlagCard from "@/components/friend-flag-card";

export const dynamic = "force-dynamic";

export default async function FrequencyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [flags, myFlag] = await Promise.all([getActiveFriendFlags(), getMyFriendFlag()]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <BackLink />
        <h1 className="text-2xl font-light tracking-tight text-warm-900">Frequency</h1>
        <p className="mt-2 text-sm leading-relaxed text-warm-500">
          Members looking to connect, right now. Post your city and what you&apos;re
          up for, or reach out to someone below.
        </p>

        <div className="mt-6">
          <FriendFlagForm
            initialLocation={myFlag?.location ?? ""}
            initialNote={myFlag?.note ?? ""}
            hasFlag={!!myFlag}
          />
        </div>

        <div className="mt-8 space-y-3">
          {flags.length > 0 ? (
            flags.map((flag) => <FriendFlagCard key={flag.id} flag={flag} />)
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">No one&apos;s posted yet.</p>
              <p className="mt-2 text-sm text-warm-400">
                Be the first to share where you are and who you&apos;re looking to meet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
