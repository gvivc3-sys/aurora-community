import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveFriendFlags, getMyFriendFlag } from "@/lib/actions/friend-flags";
import { getProfileCompletion } from "@/lib/profile-completion";
import FriendFlagForm from "@/components/friend-flag-form";
import FriendFlagCard from "@/components/friend-flag-card";
import DismissibleNote from "@/components/dismissible-note";

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
  const profileComplete = getProfileCompletion(user.user_metadata ?? {}).isComplete;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">Frequency</h1>
        <DismissibleNote id="frequency-intro" className="mt-2">
          <p className="pr-6 text-sm leading-relaxed text-warm-500 md:pr-0">
            Members looking to connect, right now. Post your city and what you&apos;re
            up for, or reach out to someone below.
          </p>
        </DismissibleNote>

        <div className="mt-6">
          {profileComplete ? (
            <FriendFlagForm
              initialLocation={myFlag?.location ?? ""}
              initialNote={myFlag?.note ?? ""}
              hasFlag={!!myFlag}
            />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center sm:p-6">
              <p className="text-sm font-medium text-amber-900">
                Complete your profile to post here
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-amber-700">
                Add your picture, name, bio, birthday, Instagram, and location so
                other members know who they&apos;re meeting.
              </p>
              <Link
                href="/profile"
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-warm-800 px-5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98]"
              >
                Complete your profile
              </Link>
            </div>
          )}
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
