import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversationMessages } from "@/lib/actions/dm";
import BackLink from "@/components/back-link";
import TimeAgo from "@/components/time-ago";
import RealtimeRefresh from "@/components/realtime-refresh";
import MessageComposer from "@/components/message-composer";
import { HeartSolidIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type Params = Promise<{ conversationId: string }>;

export default async function ConversationPage({ params }: { params: Params }) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { messages, otherUser, currentUserId } = await getConversationMessages(conversationId);

  if (!otherUser || !currentUserId) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-warm-50">
      <RealtimeRefresh table="direct_messages" />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6">
        <BackLink href="/messages" label="Back to Messages" />

        <Link
          href={`/profile/${otherUser.userId}`}
          className="mb-4 flex items-center gap-3 rounded-xl border border-warm-200 bg-white p-3 shadow-sm"
        >
          {otherUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={otherUser.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
              {otherUser.name[0]?.toUpperCase()}
            </div>
          )}
          <span className="flex items-center gap-1 text-sm font-medium text-warm-900">
            {otherUser.name}
            {otherUser.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
          </span>
        </Link>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-t-xl border border-b-0 border-warm-200 bg-white p-4">
          {messages.length > 0 ? (
            messages.map((m) => {
              const mine = m.senderId === currentUserId;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${mine ? "bg-warm-800 text-white" : "bg-warm-100 text-warm-800"}`}>
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <TimeAgo
                      date={m.createdAt}
                      className={`mt-1 block text-[10px] ${mine ? "text-warm-300" : "text-warm-400"}`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-warm-400">Say hello to {otherUser.name}.</p>
            </div>
          )}
        </div>

        <MessageComposer conversationId={conversationId} />
      </div>
    </div>
  );
}
