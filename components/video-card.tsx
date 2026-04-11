"use client";

export default function VideoCard({
  src,
  title,
  duration,
}: {
  src: string;
  title: string;
  duration: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-warm-100">
        <video
          src={src}
          className="h-full w-full object-cover"
          playsInline
          muted
          loop
          preload="metadata"
          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
          onMouseLeave={(e) => {
            const v = e.currentTarget as HTMLVideoElement;
            v.pause();
            v.currentTime = 0;
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-warm-900/10 transition-opacity duration-300 group-hover:opacity-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5 text-warm-800">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="font-medium text-warm-900">{title}</p>
        <p className="mt-1 text-xs text-warm-400">{duration}</p>
      </div>
    </div>
  );
}
