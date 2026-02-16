"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/roles";
import crypto from "crypto";

interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function verifyTelegramLogin(data: TelegramLoginData): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  const secret = crypto.createHash("sha256").update(botToken).digest();

  const checkString = Object.entries(data)
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  return hmac === data.hash;
}

export async function connectTelegram(data: TelegramLoginData): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Verify the Telegram login data
  if (!verifyTelegramLogin(data)) {
    return { success: false, error: "Invalid Telegram authentication" };
  }

  // Check auth_date is not stale (within 24 hours)
  const now = Math.floor(Date.now() / 1000);
  if (now - data.auth_date > 86400) {
    return { success: false, error: "Authentication expired, please try again" };
  }

  // Use admin client to bypass RLS
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      telegram_user_id: String(data.id),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to save Telegram user ID:", error);
    return { success: false, error: "Failed to link Telegram account" };
  }

  return { success: true };
}

export async function getTelegramInviteLink(): Promise<{
  url?: string;
  error?: string;
}> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return { error: "Telegram is not configured" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Admins can always get invite links
  const admin = isAdmin(user);
  if (!admin) {
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, telegram_user_id")
      .eq("user_id", user.id)
      .single();

    if (!sub || (sub.status !== "active" && sub.status !== "past_due")) {
      return { error: "Active subscription required" };
    }

    if (!sub.telegram_user_id) {
      return { error: "Please connect your Telegram account first" };
    }
  }

  // Create a one-time invite link
  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/createChatInviteLink`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        member_limit: 1,
        name: `Invite for ${user.email ?? user.id}`,
      }),
    },
  );

  const result = await res.json();

  if (!result.ok) {
    console.error("Telegram createChatInviteLink failed:", result);
    return { error: "Failed to create invite link" };
  }

  return { url: result.result.invite_link };
}
