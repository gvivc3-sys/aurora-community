"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SITE_PASSWORD = "goldendragon1";

export async function unlockSite(previousState: unknown, formData: FormData) {
  const password = formData.get("password") as string;

  if (password !== SITE_PASSWORD) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set("site_access", "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
  });

  redirect("/");
}
