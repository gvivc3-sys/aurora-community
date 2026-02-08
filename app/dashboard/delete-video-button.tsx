"use client";

import { useActionState } from "react";
import { deleteVideo } from "@/lib/actions/video";

export default function DeleteVideoButton({ videoId }: { videoId: string }) {
  const [state, formAction, pending] = useActionState(deleteVideo, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="videoId" value={videoId} />
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
