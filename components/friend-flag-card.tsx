import Link from "next/link";
import type { FriendFlag } from "@/lib/actions/friend-flags";
import MessageButton from "@/components/message-button";
import { HeartSolidIcon } from "@/components/icons";

export default function FriendFlagCard({ flag }: { flag: FriendFlag }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warm-200 bg-white p-4 shadow-sm">
      <Link href={`/profile/${flag.userId}`} className="shrink-0">
        {flag.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={flag.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
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
            {flag.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
          </Link>
          <span className="shrink-0 rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">
            {flag.location}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-warm-700">{flag.note}</p>
        {!flag.isMine && (
          <MessageButton
            userId={flag.userId}
            className="mt-3 rounded-full bg-warm-800 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-60"
          >
            Message
          </MessageButton>
        )}
      </div>
    </div>
  );
}
