"use client";

import { useTransition, type ReactNode } from "react";
import { deleteMyFriendFlag } from "@/lib/actions/friend-flags";
import { useToast } from "@/components/toast";

export default function UnpostButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleClick() {
    startTransition(async () => {
      try {
        await deleteMyFriendFlag();
      } catch {
        toast("Couldn't remove that post.", "error");
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className={className}>
      {isPending ? "Removing…" : (children ?? "Unpost")}
    </button>
  );
}
