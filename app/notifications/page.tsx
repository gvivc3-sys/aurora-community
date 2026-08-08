import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NotificationsList from "./notifications-list";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-3xl px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <h1 className="text-2xl font-light tracking-tight text-warm-900">
          Notifications
        </h1>
        <div className="mt-6">
          <NotificationsList />
        </div>
      </div>
    </div>
  );
}
