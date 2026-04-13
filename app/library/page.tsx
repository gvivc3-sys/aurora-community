import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import BackLink from "@/components/back-link";

export const dynamic = "force-dynamic";

function cleanName(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/-\d{10,}$/, "")
    .replace(/\bPDF\b/gi, "")
    .replace(/_/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fileType(filename: string): "pdf" | "zip" | "other" {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "zip") return "zip";
  return "other";
}

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: files } = await supabaseAdmin.storage
    .from("guides")
    .list("", { sortBy: { column: "name", order: "asc" } });

  const items = (files ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder" && !f.name.startsWith("."))
    .map((f) => {
      const { data } = supabaseAdmin.storage.from("guides").getPublicUrl(f.name);
      return { filename: f.name, url: data.publicUrl };
    });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <BackLink />

        <div className="mt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-warm-400">
            Members Only
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight text-warm-900">
            Ashley&apos;s Library
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-warm-500">
            Your collection of guides, books, and resources — all yours to keep forever.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {items.length === 0 && (
            <p className="py-12 text-center text-sm text-warm-400">
              No files yet — check back soon.
            </p>
          )}
          {items.map(({ filename, url }) => {
            const type = fileType(filename);
            const name = cleanName(filename);

            return (
              <a
                key={filename}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group flex items-center gap-4 rounded-2xl border border-warm-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-warm-300 hover:shadow-md active:scale-[0.99]"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  type === "pdf"   ? "bg-rose-50 text-rose-500" :
                  type === "zip"   ? "bg-fuchsia-50 text-fuchsia-500" :
                                     "bg-warm-100 text-warm-500"
                }`}>
                  {type === "pdf" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm5.845 17.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V12a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                      <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                    </svg>
                  )}
                  {type === "zip" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.69a.75.75 0 0 0 1.5 0v-4.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                    </svg>
                  )}
                  {type === "other" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Z" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-warm-900 group-hover:text-warm-700">
                    {name}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-warm-400">
                    {type === "zip" ? "zip archive" : type}
                  </p>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-warm-400 transition-transform group-hover:translate-y-0.5 group-hover:text-warm-600">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v8.69l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L6.22 11.53a.75.75 0 1 1 1.06-1.06l1.97 1.97V3.75A.75.75 0 0 1 10 3ZM3.75 16.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" clipRule="evenodd" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
