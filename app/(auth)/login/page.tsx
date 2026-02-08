"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900">
        Log in
      </h1>

      {message && (
        <p className="mb-4 rounded-md bg-zinc-100 p-3 text-center text-sm text-zinc-600">
          {message}
        </p>
      )}

      {state?.error && (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-zinc-500">
        <p>
          <Link
            href="/forgot-password"
            className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
