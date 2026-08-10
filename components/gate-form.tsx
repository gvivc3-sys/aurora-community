"use client";

import { useActionState } from "react";
import { unlockSite } from "@/lib/actions/gate";

export default function GateForm() {
  const [state, formAction, pending] = useActionState(unlockSite, null);

  return (
    <form action={formAction} className="mx-auto mt-12 max-w-xs">
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full rounded-lg border border-warm-300 px-4 py-2.5 text-center text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 w-full rounded-lg bg-warm-800 py-2.5 text-sm font-medium text-white transition-all hover:bg-warm-700 disabled:opacity-50"
      >
        {pending ? "Checking..." : "Enter"}
      </button>
      {state?.error && (
        <p className="mt-2 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
