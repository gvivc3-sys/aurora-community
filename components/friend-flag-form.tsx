"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { postFriendFlag, deleteMyFriendFlag } from "@/lib/actions/friend-flags";
import { useToast } from "@/components/toast";
import { MapPinIcon } from "@/components/icons";

function FlagToastEffect({ state }: { state: { error?: string; success?: boolean } | null }) {
  const { toast } = useToast();
  useEffect(() => {
    if (state?.error) {
      toast(state.error, "error");
    } else if (state?.success) {
      toast("You're on the board.", "success");
    }
  }, [state, toast]);
  return null;
}

export default function FriendFlagForm({
  locationCity,
  initialNote,
  initialAbout,
  hasFlag,
}: {
  locationCity: string;
  initialNote: string;
  initialAbout: string;
  hasFlag: boolean;
}) {
  const [state, formAction, pending] = useActionState(postFriendFlag, null);
  const [note, setNote] = useState(initialNote);
  const [about, setAbout] = useState(initialAbout);
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      await deleteMyFriendFlag();
      setNote("");
      setAbout("");
    });
  }

  return (
    <div>
      <FlagToastEffect state={state} />
      <form action={formAction} className="space-y-3">
        <div>
          <span className="mb-1 block text-xs font-medium text-warm-500">Location</span>
          {locationCity ? (
            <div className="flex items-center gap-1.5 text-sm text-warm-700">
              <MapPinIcon className="h-4 w-4 text-warm-400" />
              {locationCity}
              <Link href="/profile" className="ml-1 text-xs text-warm-400 underline decoration-warm-200 underline-offset-2 hover:text-warm-600">
                Change in profile
              </Link>
            </div>
          ) : (
            <p className="text-sm text-warm-400">
              Set your location in your{" "}
              <Link href="/profile" className="underline decoration-warm-200 underline-offset-2 hover:text-warm-600">
                profile
              </Link>{" "}
              to post here.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="flag-note" className="mb-1 block text-xs font-medium text-warm-500">
            Activity
          </label>
          <input
            id="flag-note"
            type="text"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Who wants to grab coffee?"
            maxLength={140}
            required
            className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="flag-about" className="mb-1 block text-xs font-medium text-warm-500">
            Tell us about yourself
          </label>
          <textarea
            id="flag-about"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Hobbies, interests, what you're into right now — give people something to jump off from."
            maxLength={200}
            rows={2}
            required
            className="w-full resize-none rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending || !locationCity}
            className="rounded-lg bg-warm-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? "Posting…" : hasFlag ? "Update post" : "Post to the board"}
          </button>
          {hasFlag && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-sm font-medium text-warm-400 hover:text-warm-600"
            >
              Remove
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
