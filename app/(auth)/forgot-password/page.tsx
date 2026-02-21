"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, null);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-light tracking-tight text-warm-900">
          Reset password
        </h1>
        <p className="mb-6 text-center text-sm text-warm-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {state?.error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {state.error}
          </p>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-warm-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-yellow-400 px-4 py-2.5 text-sm font-medium text-warm-900 shadow-md transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-warm-500">
          <Link
            href="/login"
            className="text-warm-700 underline underline-offset-2 hover:text-warm-900"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
