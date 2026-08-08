import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversations } from "@/lib/actions/dm";
import TimeAgo from "@/components/time-ago";
import RealtimeRefresh from "@/components/realtime-refresh";
import { HeartSolidIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversations = await getConversations();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <RealtimeRefresh table="direct_messages" />
      <div className="mx-auto max-w-2xl px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">Private Messages</h1>

        <div className="mt-6">
          {conversations.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:space-y-2">
            {conversations.map((c) => (
              <Link
                key={c.conversationId}
                href={`/messages/${c.conversationId}`}
                className={`flex cursor-pointer items-center gap-3 border-b border-warm-100 p-4 transition-colors last:border-b-0 hover:bg-warm-50 sm:rounded-xl sm:border sm:border-warm-200 sm:shadow-sm ${c.unread ? "bg-warm-50/60" : "bg-white"}`}
              >
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
                    {c.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 truncate text-sm font-medium text-warm-900">
                      {c.name}
                      {c.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
                    </span>
                    <TimeAgo date={c.lastMessageAt} className="shrink-0 text-xs text-warm-400" />
                  </div>
                  <p className={`mt-0.5 truncate text-sm ${c.unread ? "font-medium text-warm-800" : "text-warm-500"}`}>
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread && <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />}
              </Link>
            ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">No private messages yet.</p>
              <p className="mt-2 text-sm text-warm-400">
                Reach out to someone from{" "}
                <Link href="/frequency" className="text-warm-600 underline">
                  Gather
                </Link>{" "}
                to start a conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
