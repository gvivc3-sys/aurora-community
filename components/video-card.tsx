"use client";

import { useRef, useState } from "react";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

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

  function seekFromPointer(clientX: number) {
    const bar = barRef.current;
    const v = videoRef.current;
    if (!bar || !v || !videoDuration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * videoDuration;
    setCurrentTime(ratio * videoDuration);
  }

  function handleScrubStart(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    setScrubbing(true);
    seekFromPointer(e.clientX);
    const onMove = (ev: PointerEvent) => seekFromPointer(ev.clientX);
    const onUp = () => {
      setScrubbing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  if (vsl) {
    const progress = videoDuration ? (currentTime / videoDuration) * 100 : 0;
    return (
      <div className="relative w-full overflow-hidden rounded-xl shadow-2xl">
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
            onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              if (!scrubbing) setCurrentTime(e.currentTarget.currentTime);
            }}
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
          {/* Scrubber bar */}
          {videoDuration > 0 && (
            <div
              className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-[10px] tabular-nums text-white/90">
                {formatTime(currentTime)}
              </span>
              <div
                ref={barRef}
                className="group/bar relative h-3 flex-1 cursor-pointer touch-none"
                onPointerDown={handleScrubStart}
              >
                <div className="absolute inset-y-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/25" />
                <div
                  className="absolute inset-y-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-fuchsia-400"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300 shadow transition-transform group-hover/bar:scale-125"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-white/90">
                {formatTime(videoDuration)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
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
