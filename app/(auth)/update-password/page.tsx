"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/actions/auth";

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-light tracking-tight text-warm-900">
          Set new password
        </h1>
        <p className="mb-6 text-center text-sm text-warm-500">
          Enter your new password below.
        </p>

        {state?.error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-warm-700"
            >
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-warm-900 px-4 py-2.5 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-50"
          >
            {pending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
