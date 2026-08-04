import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversationMessages } from "@/lib/actions/dm";
import TimeAgo from "@/components/time-ago";
import RealtimeRefresh from "@/components/realtime-refresh";
import LockBodyScroll from "@/components/lock-body-scroll";
import ChatShell from "@/components/chat-shell";
import MessageComposer from "@/components/message-composer";
import ChatScrollAnchor from "@/components/chat-scroll-anchor";
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

  const { messages, otherUser, currentUser } = await getConversationMessages(conversationId);

  if (!otherUser || !currentUser) {
    notFound();
  }

  return (
    <ChatShell>
      <RealtimeRefresh table="direct_messages" />
      <LockBodyScroll />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-2 sm:py-4 sm:px-6">
        <div className="mb-2 flex shrink-0 items-center gap-2 rounded-full border border-warm-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm sm:mb-3">
          <Link
            href="/messages"
            aria-label="Back to Messages"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {currentUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUser.avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-200 text-[10px] font-medium text-warm-600">
                {currentUser.name[0]?.toUpperCase()}
              </div>
            )}
            <span className="truncate text-xs font-medium text-warm-400">You</span>
          </div>

          <Link href={`/profile/${otherUser.userId}`} className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
            <span className="flex min-w-0 items-center gap-1 truncate text-sm font-medium text-warm-900">
              {otherUser.name}
              {otherUser.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
            </span>
            {otherUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={otherUser.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warm-200 text-xs font-medium text-warm-600">
                {otherUser.name[0]?.toUpperCase()}
              </div>
            )}
          </Link>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-t-xl border border-b-0 border-warm-200 bg-white p-3">
          {messages.length > 0 ? (
            messages.map((m) => {
              const mine = m.senderId === currentUser.userId;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-1 text-sm leading-snug ${mine ? "bg-warm-800 text-white" : "bg-warm-100 text-warm-800"}`}>
                    <p className="whitespace-pre-wrap">
                      {m.body}{" "}
                      <TimeAgo
                        date={m.createdAt}
                        className={`text-[10px] ${mine ? "text-warm-300" : "text-warm-400"}`}
                      />
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-warm-400">Say hello to {otherUser.name}.</p>
            </div>
          )}
          <ChatScrollAnchor messageCount={messages.length} />
        </div>

        <MessageComposer conversationId={conversationId} />
      </div>
    </ChatShell>
  );
}
