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
    <div className="w-full max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-light tracking-tight text-warm-900">
        Welcome back
      </h1>
      <p className="mb-6 text-center text-sm text-warm-500">
        Sign in to your Aurora account
      </p>

      {message && (
        <p className="mb-4 rounded-lg bg-warm-100 p-3 text-center text-sm text-warm-700">
          {message}
        </p>
      )}

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

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-warm-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-warm-900 px-4 py-2.5 text-sm font-medium text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-warm-500">
        <p>
          <Link
            href="/forgot-password"
            className="text-warm-700 underline underline-offset-2 hover:text-warm-900"
          >
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-warm-700 underline underline-offset-2 hover:text-warm-900"
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
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-warm-50 px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
