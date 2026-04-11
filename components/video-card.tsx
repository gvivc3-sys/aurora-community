"use client";

import { useRef, useState } from "react";

export default function VideoCard({
  src,
  poster,
  title,
  duration,
  vsl = false,
}: {
  src: string;
  poster?: string;
  title?: string;
  duration?: string;
  vsl?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      const promise = v.play();
      if (promise !== undefined) {
        promise.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    }
  }

  function handleEnded() {
    setPlaying(false);
  }

  if (vsl) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative aspect-video w-full bg-warm-900">
          {/* Video is the tap target — iOS Safari touch events on overlaid buttons are unreliable */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="h-full w-full cursor-pointer object-cover"
            playsInline
            preload="none"
            onClick={handlePlay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={handleEnded}
          />
          {/* Visual play indicator — pointer-events-none so taps reach the video */}
          {!playing && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-8 w-8 text-warm-900"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-warm-100">
        <video
          ref={videoRef}
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
      {(title || duration) && (
        <div className="p-4">
          {title && <p className="font-medium text-warm-900">{title}</p>}
          {duration && <p className="mt-1 text-xs text-warm-400">{duration}</p>}
        </div>
      )}
    </div>
  );
}
