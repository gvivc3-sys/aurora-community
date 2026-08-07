import Link from "next/link";
import TimeAgo from "@/components/time-ago";
import { ChatBubbleIcon, HeartIcon } from "@/components/icons";

export type ThreadListItem = {
  id: string;
  title: string;
  body: string;
  author_name: string | null;
  author_avatar_url: string | null;
  file_url: string | null;
  bumped_at: string;
  replyCount: number;
  reactionCount: number;
};

export default function ConversationCard({ thread }: { thread: ThreadListItem }) {
  return (
    <Link
      href={`/conversations/${thread.id}`}
      className="flex items-start gap-3 border-b border-warm-100 p-4 transition-colors last:border-b-0 hover:bg-warm-100"
    >
      {thread.file_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thread.file_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
          {(thread.author_name || "?")[0]?.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-warm-900">{thread.title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-warm-600">{thread.body}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-warm-400">
          <span>{thread.author_name || "Unknown"}</span>
          <span>·</span>
          <TimeAgo date={thread.bumped_at} />
          <span className="ml-auto flex items-center gap-1">
            <ChatBubbleIcon className="h-3.5 w-3.5" />
            {thread.replyCount}
          </span>
          <span className="flex items-center gap-1">
            <HeartIcon className="h-3.5 w-3.5" />
            {thread.reactionCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
