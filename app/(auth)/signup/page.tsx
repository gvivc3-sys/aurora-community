"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { useToast } from "@/components/toast";

export default function SignUpPage() {
  const { toast } = useToast();
  const [state, formAction, pending] = useActionState(signUp, null);

  useEffect(() => {
    if (state?.error) {
      toast(state.error, "error");
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-warm-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-light tracking-tight text-warm-900">
          Join Aurora
        </h1>
        <p className="mb-6 text-center text-sm text-warm-500">
          Create your account and step inside
        </p>

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
              minLength={6}
              className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
            />
            <p className="mt-1 text-xs text-warm-400">
              At least 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-gradient-to-r from-warm-800 to-warm-900 px-4 py-2.5 text-sm font-medium text-warm-50 shadow-md transition-all hover:from-warm-700 hover:to-warm-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-warm-500">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-warm-700 underline underline-offset-2 hover:text-warm-900"
            >
              Sign in
            </Link>
          </p>
          <p>
            By signing up you agree to our{" "}
            <Link
              href="/community-guidelines"
              className="text-warm-700 underline underline-offset-2 hover:text-warm-900"
            >
              Community Guidelines
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
