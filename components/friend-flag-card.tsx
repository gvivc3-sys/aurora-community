import Link from "next/link";
import type { FriendFlag } from "@/lib/actions/friend-flags";
import MessageButton from "@/components/message-button";
import UnpostButton from "@/components/unpost-button";
import { HeartSolidIcon, EnvelopeIcon, ArrowUturnLeftIcon } from "@/components/icons";

export default function FriendFlagCard({ flag, isAdmin = false }: { flag: FriendFlag; isAdmin?: boolean }) {
  return (
    <div className="flex items-start gap-3 border-b border-warm-100 p-3 last:border-b-0 sm:p-4">
      <Link href={`/profile/${flag.userId}`} className="shrink-0">
        {flag.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={flag.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover object-top" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
            {flag.name[0]?.toUpperCase()}
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/profile/${flag.userId}`}
            className="flex items-center gap-1 text-sm font-medium text-warm-900 hover:underline"
          >
            {flag.name}
            {flag.isMine && <span className="font-normal text-warm-400">(You)</span>}
            {flag.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
          </Link>
          <span className="max-w-[45%] shrink-0 truncate rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">
            {flag.location}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-warm-700">{flag.note}</p>
        {flag.about && (
          <div className="mt-2 rounded-lg bg-warm-50 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-warm-400">FYI</p>
            <p className="mt-0.5 text-sm leading-relaxed text-warm-600">{flag.about}</p>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          {flag.isMine ? (
            <UnpostButton className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-xs font-medium text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              <ArrowUturnLeftIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5 group-hover:-rotate-12" />
              Unpost
            </UnpostButton>
          ) : (
            <>
              <MessageButton
                userId={flag.userId}
                className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-xs font-medium text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <EnvelopeIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6" />
                Message
              </MessageButton>
              {isAdmin && (
                <UnpostButton
                  targetUserId={flag.userId}
                  confirmLabel="Delete this post?"
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-warm-300 bg-transparent px-4 py-1.5 text-xs font-medium text-warm-700 transition-all hover:bg-warm-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowUturnLeftIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-x-0.5 group-hover:-rotate-12" />
                  Delete
                </UnpostButton>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
