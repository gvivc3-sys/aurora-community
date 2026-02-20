/**
 * Server-side mention extraction and linking utilities.
 */

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Extract mentioned user IDs from processed HTML (mentions already linkified).
 */
export function extractMentionsFromHtml(html: string): string[] {
  const ids: string[] = [];

  // Match href="/profile/{uuid}" on mention links
  const hrefRegex = /class="mention"[^>]*href="\/profile\/([^"]+)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    if (match[1] && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  // Also try href before class
  const hrefRegex2 = /href="\/profile\/([^"]+)"[^>]*class="mention"/g;
  while ((match = hrefRegex2.exec(html)) !== null) {
    if (match[1] && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  return ids;
}

/**
 * Extract @handle patterns from plaintext or HTML text content.
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

/**
 * Resolve handles to a map of handle → user_id.
 */
async function resolveHandlesMap(
  handles: string[],
): Promise<Record<string, string>> {
  if (handles.length === 0) return {};

  const { data } = await supabaseAdmin
    .from("user_handles")
    .select("user_id, handle")
    .in("handle", handles);

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.handle] = row.user_id;
  }
  return map;
}

/**
 * Replace @handle patterns in HTML with styled <a> links to profiles.
 * Only replaces handles that exist in the database.
 * Skips @handles that are already inside HTML tags.
 */
export async function linkifyMentionsInHtml(html: string): Promise<string> {
  const handles = extractMentionsFromText(html.replace(/<[^>]*>/g, ""));
  if (handles.length === 0) return html;

  const handleMap = await resolveHandlesMap(handles);
  if (Object.keys(handleMap).length === 0) return html;

  // Replace @handle in text content only (not inside HTML tags)
  // Split by HTML tags, process text segments only
  const parts = html.split(/(<[^>]*>)/);
  for (let i = 0; i < parts.length; i++) {
    // Skip HTML tag segments (odd indices from split)
    if (parts[i].startsWith("<")) continue;

    // Replace @handles in this text segment
    parts[i] = parts[i].replace(/@([a-z][a-z0-9_]{2,19})\b/g, (match, handle) => {
      const userId = handleMap[handle];
      if (!userId) return match;
      return `<a href="/profile/${userId}" class="mention">@${handle}</a>`;
    });
  }

  return parts.join("");
}
