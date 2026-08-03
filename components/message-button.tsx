"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/lib/actions/dm";
import { useToast } from "@/components/toast";

export default function MessageButton({
  userId,
  className,
  children,
}: {
  userId: string;
  className?: string;
  children?: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleClick() {
    startTransition(async () => {
      try {
        const conversationId = await getOrCreateConversation(userId);
        router.push(`/messages/${conversationId}`);
      } catch {
        toast("Couldn't start that conversation.", "error");
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className={className}>
      {isPending ? "Opening…" : (children ?? "Message")}
    </button>
  );
}
