"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserIdentity } from "@/lib/user-identity";

const MAX_MESSAGE_LENGTH = 2000;

export async function getOrCreateConversation(otherUserId: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  if (user.id === otherUserId) throw new Error("Cannot message yourself");

  const [{ data: mine }, { data: theirs }] = await Promise.all([
    supabaseAdmin.from("conversation_participants").select("conversation_id").eq("user_id", user.id),
    supabaseAdmin.from("conversation_participants").select("conversation_id").eq("user_id", otherUserId),
  ]);

  const mineIds = new Set((mine ?? []).map((r) => r.conversation_id));
  const shared = (theirs ?? []).find((r) => mineIds.has(r.conversation_id));
  if (shared) return shared.conversation_id;

  const { data: conversation, error } = await supabaseAdmin
    .from("conversations")
    .insert({})
    .select("id")
    .single();

  if (error || !conversation) throw new Error("Could not start conversation");

  await supabaseAdmin.from("conversation_participants").insert([
    { conversation_id: conversation.id, user_id: user.id },
    { conversation_id: conversation.id, user_id: otherUserId },
  ]);

  return conversation.id;
}

export type ConversationSummary = {
  conversationId: string;
  otherUserId: string;
  name: string;
  avatarUrl: string | null;
  verified: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
};

export async function getConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: participantRows } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id);

  if (!participantRows || participantRows.length === 0) return [];

  const conversationIds = participantRows.map((r) => r.conversation_id);

  const { data: otherRows } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("conversation_id", conversationIds)
    .neq("user_id", user.id);

  const otherByConversation = new Map((otherRows ?? []).map((r) => [r.conversation_id, r.user_id]));
  const lastReadByConversation = new Map(participantRows.map((r) => [r.conversation_id, r.last_read_at]));

  const results = await Promise.all(
    conversationIds.map(async (conversationId) => {
      const otherUserId = otherByConversation.get(conversationId);
      if (!otherUserId) return null;

      const { data: lastMessage } = await supabaseAdmin
        .from("direct_messages")
        .select("body, created_at, sender_id")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!lastMessage) return null;

      const identity = await getUserIdentity(otherUserId);
      const lastReadAt = lastReadByConversation.get(conversationId);
      const unread =
        lastMessage.sender_id !== user.id &&
        (!lastReadAt || new Date(lastMessage.created_at) > new Date(lastReadAt));

      return {
        conversationId,
        otherUserId,
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        verified: identity.verified,
        lastMessage: lastMessage.body,
        lastMessageAt: lastMessage.created_at,
        unread,
      };
    }),
  );

  return results
    .filter((r): r is ConversationSummary => r !== null)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export type DirectMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export async function getConversationMessages(conversationId: string): Promise<{
  messages: DirectMessage[];
  otherUser: Awaited<ReturnType<typeof getUserIdentity>> | null;
  currentUser: Awaited<ReturnType<typeof getUserIdentity>> | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { messages: [], otherUser: null, currentUser: null };

  const { data: participant } = await supabaseAdmin
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!participant) return { messages: [], otherUser: null, currentUser: null };

  const { data: otherParticipant } = await supabaseAdmin
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id)
    .maybeSingle();

  const [otherUser, currentUser] = await Promise.all([
    otherParticipant ? getUserIdentity(otherParticipant.user_id) : Promise.resolve(null),
    getUserIdentity(user.id),
  ]);

  const { data: messages } = await supabaseAdmin
    .from("direct_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  await supabaseAdmin
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id);

  return {
    messages: (messages ?? []).map((m) => ({
      id: m.id,
      senderId: m.sender_id,
      body: m.body,
      createdAt: m.created_at,
    })),
    otherUser,
    currentUser,
  };
}

export async function sendDirectMessage(
  conversationId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const body = (formData.get("body") as string)?.trim() ?? "";
  if (!body) return { error: "Message can't be empty." };
  if (body.length > MAX_MESSAGE_LENGTH) return { error: "Message is too long." };

  const { data: participant } = await supabaseAdmin
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!participant) return { error: "Conversation not found." };

  const { error } = await supabaseAdmin.from("direct_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body,
  });

  if (error) return { error: "Something went wrong. Please try again." };

  const { data: otherParticipant } = await supabaseAdmin
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id)
    .maybeSingle();

  if (otherParticipant) {
    const senderIdentity = await getUserIdentity(user.id);
    await supabaseAdmin.from("notifications").insert({
      user_id: otherParticipant.user_id,
      type: "direct_message",
      actor_id: user.id,
      actor_name: senderIdentity.name,
      actor_avatar_url: senderIdentity.avatarUrl,
      resource_type: "conversation",
      resource_id: conversationId,
      body_preview: body.slice(0, 200),
    });
  }

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return {};
}
