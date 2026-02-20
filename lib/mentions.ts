/**
 * Server-side mention extraction utilities.
 */

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Extract mentioned user IDs from Tiptap HTML output.
 * Looks for <a data-type="mention" href="/profile/uuid"> or data-id="uuid".
 */
export function extractMentionsFromHtml(html: string): string[] {
  const ids: string[] = [];

  // Match href="/profile/{uuid}" on mention links
  const hrefRegex = /data-type="mention"[^>]*href="\/profile\/([^"]+)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    if (match[1] && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  // Also match data-id for backwards compatibility
  const idRegex = /data-type="mention"[^>]*data-id="([^"]+)"/g;
  while ((match = idRegex.exec(html)) !== null) {
    if (match[1] && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  return ids;
}

/**
 * Extract @handle patterns from plaintext.
 */
export function extractMentionsFromText(text: string): string[] {
  const regex = /@([a-z][a-z0-9_]{2,19})\b/g;
  const handles: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1] && !handles.includes(match[1])) {
      handles.push(match[1]);
    }
  }
  return handles;
}

/**
 * Resolve an array of handles to user IDs via the user_handles table.
 */
export async function resolveHandlesToUserIds(
  handles: string[],
): Promise<string[]> {
  if (handles.length === 0) return [];

  const { data } = await supabaseAdmin
    .from("user_handles")
    .select("user_id")
    .in("handle", handles);

  return (data ?? []).map((row) => row.user_id);
}
