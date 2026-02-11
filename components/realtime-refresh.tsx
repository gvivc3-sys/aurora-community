"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

type Props = {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
};

export default function RealtimeRefresh({ table, event = "*" }: Props) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event, schema: "public", table },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, router]);

  return null;
}
