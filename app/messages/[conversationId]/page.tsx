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

  const { messages, otherUser, currentUser } = await getConversationMessages(conversationId);

  if (!otherUser || !currentUser) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100dvh-6.375rem)] flex-col bg-warm-50 md:h-[calc(100dvh-3.5rem)]">
      <RealtimeRefresh table="direct_messages" />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-2 sm:py-4 sm:px-6">
        <BackLink href="/messages" label="Back to Messages" className="mb-2 sm:mb-4" />

        <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-warm-200 bg-white p-3 shadow-sm sm:mb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {currentUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUser.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
                {currentUser.name[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-warm-900">You</p>
              {currentUser.location && (
                <p className="truncate text-xs text-warm-400">{currentUser.location}</p>
              )}
            </div>
          </div>

          <div className="h-8 w-px shrink-0 bg-warm-100" />

          <Link href={`/profile/${otherUser.userId}`} className="flex min-w-0 items-center gap-2.5 justify-end">
            <div className="min-w-0 text-right">
              <p className="flex items-center justify-end gap-1 truncate text-sm font-medium text-warm-900">
                {otherUser.name}
                {otherUser.verified && <HeartSolidIcon className="h-3 w-3 shrink-0 text-fuchsia-500" />}
              </p>
              {otherUser.location && (
                <p className="truncate text-xs text-warm-400">{otherUser.location}</p>
              )}
            </div>
            {otherUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={otherUser.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-200 text-sm font-medium text-warm-600">
                {otherUser.name[0]?.toUpperCase()}
              </div>
            )}
          </Link>
        </div>

        <p className="mb-2 text-center text-[11px] leading-snug text-warm-400">
          For your safety: verify who you&apos;re talking to. A video call or
          Instagram check goes a long way before meeting up.
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-t-xl border border-b-0 border-warm-200 bg-white p-4">
          {messages.length > 0 ? (
            messages.map((m) => {
              const mine = m.senderId === currentUser.userId;
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
