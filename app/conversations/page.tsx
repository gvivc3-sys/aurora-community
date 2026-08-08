import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationComposer from "@/components/conversation-composer";
import ConversationCard, { type ThreadListItem } from "@/components/conversation-card";
import RealtimeRefresh from "@/components/realtime-refresh";
import MobileComposerSheet from "@/components/mobile-composer-sheet";
import InfoTooltip from "@/components/info-tooltip";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("threads")
    .select("*")
    .order("bumped_at", { ascending: false })
    .limit(15);

  const threadIds = (data ?? []).map((t) => t.id);

  const [{ data: replyRows }, { data: reactionRows }] = await Promise.all([
    threadIds.length > 0
      ? supabase.from("thread_replies").select("thread_id").in("thread_id", threadIds)
      : Promise.resolve({ data: [] as { thread_id: string }[] }),
    threadIds.length > 0
      ? supabase.from("thread_reactions").select("thread_id").in("thread_id", threadIds)
      : Promise.resolve({ data: [] as { thread_id: string | null }[] }),
  ]);

  const threads: ThreadListItem[] = (data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    body: t.body,
    author_name: t.author_name,
    author_avatar_url: t.author_avatar_url,
    file_url: t.file_url,
    bumped_at: t.bumped_at,
    replyCount: (replyRows ?? []).filter((r) => r.thread_id === t.id).length,
    reactionCount: (reactionRows ?? []).filter((r) => r.thread_id === t.id).length,
  }));

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <RealtimeRefresh table="threads" />
      <div className="mx-auto max-w-2xl px-2 pb-24 pt-5 sm:px-6 sm:pb-24 sm:pt-6 md:pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-tight text-warm-900">Discussions</h1>
          <InfoTooltip text="Start a thread, or jump into one below. Active discussions stay near the top; the board holds the 15 most active at a time." />
        </div>
        <div className="mt-4">
          <MobileComposerSheet label="Start a discussion">
            <ConversationComposer />
          </MobileComposerSheet>
        </div>

        <div className="mt-8">
          {threads.length > 0 ? (
            <div className="border-t border-warm-100 sm:overflow-hidden sm:rounded-xl sm:border sm:border-warm-200 sm:bg-white sm:shadow-sm">
              {threads.map((thread) => <ConversationCard key={thread.id} thread={thread} />)}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-light text-warm-400">No discussions yet.</p>
              <p className="mt-2 text-sm text-warm-400">Be the first to start one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
