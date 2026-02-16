"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { connectTelegram, getTelegramInviteLink } from "@/lib/actions/telegram";

interface TelegramConnectProps {
  telegramUserId: string | null;
  botUsername: string;
}

export default function TelegramConnect({
  telegramUserId,
  botUsername,
}: TelegramConnectProps) {
  const [connected, setConnected] = useState(!!telegramUserId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Global callback for the Telegram Login Widget
  const handleTelegramAuth = useCallback(
    async (data: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) => {
      setLoading(true);
      setError(null);

      const result = await connectTelegram(data);

      if (result.success) {
        setConnected(true);
      } else {
        setError(result.error ?? "Failed to connect Telegram");
      }

      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (connected || !widgetRef.current) return;

    // Expose global callback — must be a plain function on window
    // so the Telegram popup can call it after auth
    const w = window as unknown as Record<string, unknown>;
    w.onTelegramAuth = (user: Record<string, unknown>) => {
      handleTelegramAuth(
        user as unknown as {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          photo_url?: string;
          auth_date: number;
          hash: string;
        },
      );
    };

    // Load the Telegram Login Widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "24");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    widgetRef.current.appendChild(script);

    return () => {
      delete w.onTelegramAuth;
    };
  }, [connected, botUsername, handleTelegramAuth]);

  const handleGetInvite = async () => {
    setLoading(true);
    setError(null);

    const result = await getTelegramInviteLink();

    if (result.url) {
      window.open(result.url, "_blank");
    } else {
      setError(result.error ?? "Failed to get invite link");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-[#2AABEE] px-8 py-3 text-sm font-medium text-white opacity-60">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Connecting...
        </div>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-warm-600">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-green-500"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          Telegram connected
        </div>
        <button
          type="button"
          onClick={handleGetInvite}
          className="flex items-center gap-2 rounded-full bg-[#2AABEE] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#229ED9]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38Z"
              fill="currentColor"
            />
          </svg>
          Join Group
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="button"
          onClick={handleGetInvite}
          className="text-xs text-warm-400 underline hover:text-warm-600"
        >
          Get new invite link
        </button>
      </div>
    );
  }

  // Not connected — show the Telegram Login Widget
  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={widgetRef} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-warm-400">
        Click to connect your Telegram account
      </p>
    </div>
  );
}
