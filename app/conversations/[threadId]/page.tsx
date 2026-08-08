import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import ConversationDetail, { type ReplyItem } from "@/components/conversation-detail";
import RealtimeRefresh from "@/components/realtime-refresh";

export const dynamic = "force-dynamic";

type Params = Promise<{ threadId: string }>;

export default async function ConversationDetailPage({ params }: { params: Params }) {
  const { threadId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: thread } = await supabase.from("threads").select("*").eq("id", threadId).maybeSingle();
  if (!thread) {
    notFound();
  }

  const { data: replies } = await supabase
    .from("thread_replies")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const replyIds = (replies ?? []).map((r) => r.id);

  const [{ data: threadReactions }, { data: replyReactions }] = await Promise.all([
    supabase.from("thread_reactions").select("user_id").eq("thread_id", threadId),
    replyIds.length > 0
      ? supabase.from("thread_reactions").select("user_id, reply_id").in("reply_id", replyIds)
      : Promise.resolve({ data: [] as { user_id: string; reply_id: string | null }[] }),
  ]);

  const replyItems: ReplyItem[] = (replies ?? []).map((r) => {
    const reactionsForReply = (replyReactions ?? []).filter((rr) => rr.reply_id === r.id);
    return {
      id: r.id,
      author_id: r.author_id,
      author_name: r.author_name,
      author_avatar_url: r.author_avatar_url,
      body: r.body,
      file_url: r.file_url,
      file_type: r.file_type,
      created_at: r.created_at,
      reactionCount: reactionsForReply.length,
      reactedByMe: reactionsForReply.some((rr) => rr.user_id === user.id),
    };
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <RealtimeRefresh table="thread_replies" />
      <RealtimeRefresh table="thread_reactions" />
      <div className="mx-auto max-w-3xl px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <Link
          href="/conversations"
          className="mb-4 inline-flex items-center gap-1 text-sm text-warm-500 transition-colors hover:text-warm-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Discussions
        </Link>

        <ConversationDetail
          thread={{
            id: thread.id,
            title: thread.title,
            body: thread.body,
            author_id: thread.author_id,
            author_name: thread.author_name,
            author_avatar_url: thread.author_avatar_url,
            file_url: thread.file_url,
            file_type: thread.file_type,
            created_at: thread.created_at,
            reactionCount: (threadReactions ?? []).length,
            reactedByMe: (threadReactions ?? []).some((r) => r.user_id === user.id),
          }}
          replies={replyItems}
          currentUserId={user.id}
          isAdmin={isAdmin(user)}
        />
      </div>
    </div>
  );
}
