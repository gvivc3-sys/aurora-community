import type { User } from "@supabase/supabase-js";

export function getUserRole(user: User): "admin" | "member" {
  return user.app_metadata?.role === "admin" ? "admin" : "member";
}

export function isAdmin(user: User): boolean {
  return getUserRole(user) === "admin";
}
