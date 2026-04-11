"use client";

import { useRef, useState } from "react";

export default function VideoCard({
  src,
  title,
  duration,
  vsl = false,
}: {
  src: string;
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
      v.play();
      setPlaying(true);
    }
  }

  function handleEnded() {
    setPlaying(false);
  }

  if (vsl) {
    return (
      <div className="group relative w-full overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative aspect-video w-full overflow-hidden bg-warm-900">
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full object-cover"
            playsInline
            preload="metadata"
            onEnded={handleEnded}
          />
          {!playing && (
            <button
              onClick={handlePlay}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center bg-warm-900/30 transition-colors hover:bg-warm-900/20"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform hover:scale-105 active:scale-95">
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
            </button>
          )}
          {playing && (
            <button
              onClick={handlePlay}
              aria-label="Pause video"
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-warm-900"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
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
