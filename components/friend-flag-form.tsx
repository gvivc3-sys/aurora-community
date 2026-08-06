"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { postFriendFlag, deleteMyFriendFlag } from "@/lib/actions/friend-flags";
import { useToast } from "@/components/toast";

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
  initialLocation,
  initialNote,
  hasFlag,
}: {
  initialLocation: string;
  initialNote: string;
  hasFlag: boolean;
}) {
  const [state, formAction, pending] = useActionState(postFriendFlag, null);
  const [location, setLocation] = useState(initialLocation);
  const [note, setNote] = useState(initialNote);
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      await deleteMyFriendFlag();
      setLocation("");
      setNote("");
    });
  }

  return (
    <div>
      <FlagToastEffect state={state} />
      <form action={formAction}>
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New York, NY"
            maxLength={60}
            required
            className="rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
          />
          <input
            type="text"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Who wants to grab coffee?"
            maxLength={140}
            required
            className="rounded-lg border border-warm-200 px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:border-warm-400 focus:outline-none"
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
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
