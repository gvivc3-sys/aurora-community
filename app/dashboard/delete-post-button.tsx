"use client";

import { useActionState } from "react";
import { deletePost } from "@/lib/actions/post";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(deletePost, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="postId" value={postId} />
      {state?.error && (
        <p className="text-xs text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}
