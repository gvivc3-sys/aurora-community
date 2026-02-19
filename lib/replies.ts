export type Reply = {
  body: string;
  created_at: string;
  mode: "private" | "public";
  author_name: string;
  role: "admin" | "user";
};

export function parseReplies(replyBody: string | null): Reply[] {
  if (!replyBody) return [];
  try {
    const parsed = JSON.parse(replyBody);
    if (Array.isArray(parsed)) {
      return parsed.map((entry: Partial<Reply>) => ({
        ...entry,
        body: entry.body ?? "",
        created_at: entry.created_at ?? "",
        mode: entry.mode ?? "private",
        author_name: entry.author_name ?? "Ashley",
        role: entry.role ?? "admin",
      })) as Reply[];
    }
  } catch {}
  // Legacy: plain HTML string
  return [{ body: replyBody, created_at: "", mode: "private", author_name: "Ashley", role: "admin" }];
}
