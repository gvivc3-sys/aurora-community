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
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <RealtimeRefresh table="direct_messages" />
      <div className="mx-auto max-w-2xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">Messages</h1>

        <div className="mt-6 space-y-2">
          {conversations.length > 0 ? (
            conversations.map((c) => (
              <Link
                key={c.conversationId}
                href={`/messages/${c.conversationId}`}
                className={`flex items-center gap-3 rounded-xl border border-warm-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${c.unread ? "bg-warm-50/60" : ""}`}
              >
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
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
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">No messages yet.</p>
              <p className="mt-2 text-sm text-warm-400">
                Reach out to someone from{" "}
                <Link href="/frequency" className="text-warm-600 underline">
                  Frequency
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
