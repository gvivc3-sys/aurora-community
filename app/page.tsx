import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50">
      <div className="max-w-lg px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Aurora Community
        </h1>
        <p className="mt-4 text-lg text-zinc-500">
          A space for members to connect, learn, and grow together.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
