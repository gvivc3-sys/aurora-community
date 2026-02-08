import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { isAdmin } from "@/lib/roles";
import Avatar from "@/components/avatar";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          Aurora Community
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Feed
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-zinc-100"
              >
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  name={user.user_metadata?.username}
                  email={user.email}
                  size="sm"
                />
                <span className="text-sm text-zinc-700">
                  {user.user_metadata?.username || user.email}
                </span>
                {isAdmin(user) && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                    Admin
                  </span>
                )}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
