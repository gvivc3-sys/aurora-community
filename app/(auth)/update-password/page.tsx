"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
          Set new password
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500">
          Enter your new password below.
        </p>

        {state?.error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
          >
            {pending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
