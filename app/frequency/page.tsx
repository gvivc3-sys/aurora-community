import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveFriendFlags, getMyFriendFlag } from "@/lib/actions/friend-flags";
import { getProfileCompletion } from "@/lib/profile-completion";
import FriendFlagForm from "@/components/friend-flag-form";
import FriendFlagCard from "@/components/friend-flag-card";
import MobileComposerSheet from "@/components/mobile-composer-sheet";
import InfoTooltip from "@/components/info-tooltip";

export const dynamic = "force-dynamic";

export default async function GatherPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [flags, myFlag] = await Promise.all([getActiveFriendFlags(), getMyFriendFlag()]);
  const profileComplete = getProfileCompletion(user.user_metadata ?? {}).isComplete;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-5 sm:px-6 sm:pb-24 sm:pt-6 md:pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-tight text-warm-900">Gather</h1>
          <InfoTooltip text="Members looking to connect, right now. Post your city and what you're up for — visible for 14 days — or reach out to someone below." />
        </div>

        <div className="mt-4">
          {profileComplete ? (
            <MobileComposerSheet label="Post to Gather">
              <FriendFlagForm
                initialLocation={myFlag?.location ?? ""}
                initialNote={myFlag?.note ?? ""}
                hasFlag={!!myFlag}
              />
            </MobileComposerSheet>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-sm font-medium text-amber-900">
                Complete your profile to post here
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-amber-700">
                Add your picture, name, bio, birthday, Instagram, and location so
                other members know who they&apos;re meeting.
              </p>
              <Link
                href="/profile"
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-warm-800 px-5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98]"
              >
                Complete your profile
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8">
          {flags.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
              {flags.map((flag) => <FriendFlagCard key={flag.id} flag={flag} />)}
            </div>
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
