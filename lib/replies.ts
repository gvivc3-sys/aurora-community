export type Reply = {
  body: string;
  created_at: string;
  mode: "private" | "public";
};

export function parseReplies(replyBody: string | null): Reply[] {
  if (!replyBody) return [];
  try {
    const parsed = JSON.parse(replyBody);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // Legacy: plain HTML string
  return [{ body: replyBody, created_at: "", mode: "private" }];
}
