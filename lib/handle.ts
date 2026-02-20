/**
 * Handle validation and auto-generation utilities.
 * Handles are lowercase, start with a letter, 3–20 chars, only [a-z0-9_].
 */

const HANDLE_REGEX = /^[a-z][a-z0-9_]{2,19}$/;

export function isValidHandle(handle: string): boolean {
  return HANDLE_REGEX.test(handle);
}

/**
 * Auto-generate a handle from a display name.
 * Lowercases, replaces non-alphanumeric with underscores,
 * collapses/trims underscores, pads if < 3 chars, clamps to 20.
 */
export function generateHandle(displayName: string): string {
  let handle = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  // Ensure starts with a letter
  if (handle && !/^[a-z]/.test(handle)) {
    handle = "u_" + handle;
  }

  // Pad if too short
  while (handle.length < 3) {
    handle += "_";
  }

  // Clamp to 20 chars
  handle = handle.slice(0, 20);

  // Trim trailing underscores from clamping
  handle = handle.replace(/_+$/, "");

  // Pad again if trimming made it too short
  while (handle.length < 3) {
    handle += "x";
  }

  return handle;
}
