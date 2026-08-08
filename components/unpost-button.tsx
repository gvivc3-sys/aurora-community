"use client";

import { useState, useTransition, type ReactNode } from "react";
import { deleteMyFriendFlag } from "@/lib/actions/friend-flags";
import { useToast } from "@/components/toast";

export default function UnpostButton({
  className,
  children,
  targetUserId,
  confirmLabel,
}: {
  className?: string;
  children?: ReactNode;
  targetUserId?: string;
  confirmLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const { toast } = useToast();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMyFriendFlag(targetUserId);
      if (result?.error) toast(result.error, "error");
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5 text-xs">
        <span className="text-warm-500">{confirmLabel ?? "Remove this post?"}</span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-warm-400 hover:text-warm-600"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (targetUserId ? setConfirming(true) : handleDelete())}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Removing…" : (children ?? "Unpost")}
    </button>
  );
}
