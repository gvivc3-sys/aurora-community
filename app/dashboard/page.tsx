import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/roles";
import { extractVimeoId, getVimeoEmbedUrl } from "@/lib/vimeo";
import PostVideoForm from "./post-video-form";
import DeleteVideoButton from "./delete-video-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  const admin = isAdmin(user);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Feed</h1>
        <p className="mt-2 text-zinc-500">
          Latest videos from the community.
        </p>

        {admin && (
          <div className="mt-8">
            <PostVideoForm />
          </div>
        )}

        <div className="mt-8 space-y-6">
          {videos && videos.length > 0 ? (
            videos.map((video) => {
              const vimeoId = extractVimeoId(video.vimeo_url);
              return (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                >
                  {vimeoId && (
                    <div className="aspect-video">
                      <iframe
                        src={getVimeoEmbedUrl(vimeoId)}
                        className="h-full w-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <h3 className="font-medium text-zinc-900">
                        {video.title}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {admin && <DeleteVideoButton videoId={video.id} />}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-12 text-center text-zinc-400">No videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
