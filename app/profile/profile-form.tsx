"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, updateAvatar } from "@/lib/actions/profile";
import { createPortalSession } from "@/lib/actions/stripe";
import { getZodiacSign } from "@/lib/zodiac";
import Avatar from "@/components/avatar";
import BackLink from "@/components/back-link";
import { useToast } from "@/components/toast";

function ProfileToastEffect({ state }: { state: { error?: string; success?: boolean } | null }) {
  const { toast } = useToast();
  useEffect(() => {
    if (state && "error" in state && state.error) {
      toast(state.error, "error");
    } else if (state && "success" in state) {
      toast("Profile updated.", "success");
    }
  }, [state, toast]);
  return null;
}

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();
  const meta = user.user_metadata ?? {};
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    meta.avatar_url ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [birthday, setBirthday] = useState<string>(meta.birthday ?? "");

  const zodiac = birthday ? getZodiacSign(new Date(birthday)) : null;

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      toast("Upload failed: " + uploadError.message, "error");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // Append cache-buster so the browser fetches the new image
    const freshUrl = `${publicUrl}?t=${Date.now()}`;

    const oldAvatarUrl = avatarUrl;
    await supabase.auth.updateUser({ data: { avatar_url: freshUrl } });
    setAvatarUrl(freshUrl);

    const result = await updateAvatar();
    if (result && "error" in result) {
      toast(result.error ?? "Avatar update failed.", "error");
      // Revert avatar in metadata
      await supabase.auth.updateUser({ data: { avatar_url: oldAvatarUrl ?? undefined } });
      setAvatarUrl(oldAvatarUrl);
    }

    setUploading(false);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-16">
        <BackLink />
        <h1 className="text-2xl font-light tracking-tight text-warm-900">Your Profile</h1>
        <p className="mt-1 text-sm text-warm-500">{user.email}</p>

        {/* Avatar card */}
        <div className="mt-8 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-warm-500">Profile picture</h2>
          <div className="mt-4 flex items-center gap-5">
            <Avatar
              src={avatarUrl}
              name={meta.username}
              email={user.email}
              size="lg"
            />
            <div>
              <label className="cursor-pointer rounded-full border border-warm-300 bg-white px-4 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50">
                {uploading ? "Uploading..." : "Change picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleAvatarUpload}
                />
              </label>
              <p className="mt-2 text-xs text-warm-400">
                JPG, PNG, or GIF. Max 2 MB.
              </p>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-6 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-warm-500">
            Personal information
          </h2>

          <ProfileToastEffect state={state} />

          <form action={formAction} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-warm-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={meta.username ?? ""}
                className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
                placeholder="Pick a display name"
              />
            </div>

            <div>
              <label
                htmlFor="handle"
                className="mb-1 block text-sm font-medium text-warm-700"
              >
                Handle
              </label>
              <div className="flex items-center rounded-lg border border-warm-300 focus-within:border-warm-500 focus-within:ring-1 focus-within:ring-warm-500">
                <span className="pl-3 text-sm text-warm-400">@</span>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  defaultValue={meta.handle ?? ""}
                  maxLength={14}
                  className="w-full border-0 bg-transparent px-2 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-0"
                  placeholder="auto-generated from your name"
                />
              </div>
              <p className="mt-1 text-xs text-warm-400">
                3-14 characters. Lowercase letters, numbers, underscores. Must start with a letter.
              </p>
            </div>

            <div>
              <label
                htmlFor="birthday"
                className="mb-1 block text-sm font-medium text-warm-700"
              >
                Birthday
              </label>
              <input
                id="birthday"
                name="birthday"
                type="date"
                min="1920-01-01"
                max={new Date().toISOString().split("T")[0]}
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
              />
            </div>

            {zodiac && (
              <div className="rounded-lg bg-warm-100 p-3 text-sm text-warm-700">
                <span className="text-lg">{zodiac.symbol}</span>{" "}
                <strong>{zodiac.name}</strong> — {zodiac.element} sign (
                {zodiac.dateRange})
              </div>
            )}

            <div>
              <label
                htmlFor="bio"
                className="mb-1 block text-sm font-medium text-warm-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                maxLength={300}
                defaultValue={meta.bio ?? ""}
                className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:border-warm-500 focus:outline-none focus:ring-1 focus:ring-warm-500"
                placeholder="Tell the portal a little about yourself..."
              />
            </div>

            <div>
              <label
                htmlFor="telegram_handle"
                className="mb-1 block text-sm font-medium text-warm-700"
              >
                Telegram
              </label>
              <div className="flex items-center rounded-lg border border-warm-300 focus-within:border-warm-500 focus-within:ring-1 focus-within:ring-warm-500">
                <span className="pl-3 text-sm text-warm-400">@</span>
                <input
                  id="telegram_handle"
                  name="telegram_handle"
                  type="text"
                  defaultValue={meta.telegram_handle ?? ""}
                  className="w-full border-0 bg-transparent px-2 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-0"
                  placeholder="yourhandle"
                />
              </div>
              <p className="mt-1 text-xs text-warm-400">
                Optional. Just the handle.
              </p>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-warm-800 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-warm-700 active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
        {/* Subscription card */}
        <div className="mt-6 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-warm-500">Subscription</h2>
          <p className="mt-2 text-sm text-warm-700">
            Manage your billing, update payment method, or cancel your
            membership through the Stripe customer portal.
          </p>
          <form action={createPortalSession} className="mt-4">
            <button
              type="submit"
              className="rounded-full border border-warm-300 bg-white px-5 py-2 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50"
            >
              Manage Subscription
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
