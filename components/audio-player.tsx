"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type AudioPlayerProps = {
  src: string;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<import("wavesurfer.js").default | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const initWaveSurfer = useCallback(async () => {
    if (!containerRef.current) return;

    const WaveSurfer = (await import("wavesurfer.js")).default;

    // Destroy previous instance if re-mounting
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#d4c9b8",
      progressColor: "#5c5040",
      cursorColor: "#2c2418",
      cursorWidth: 1,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 48,
      normalize: true,
      hideScrollbar: true,
      url: src,
    });

    ws.on("ready", () => {
      setDuration(ws.getDuration());
      setReady(true);
    });

    ws.on("timeupdate", (time: number) => {
      setCurrentTime(time);
    });

    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("finish", () => setPlaying(false));

    wavesurferRef.current = ws;
  }, [src]);

  useEffect(() => {
    initWaveSurfer();
    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [initWaveSurfer]);

  function togglePlay() {
    wavesurferRef.current?.playPause();
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-warm-50 px-4 py-3">
      {/* Play/Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!ready}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-900 text-warm-50 transition-colors hover:bg-warm-800 disabled:opacity-40"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 ml-0.5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Waveform */}
      <div className="min-w-0 flex-1">
        <div ref={containerRef} className="w-full" />
      </div>

      {/* Time display */}
      <span className="shrink-0 font-mono text-xs text-warm-500">
        {ready ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:--"}
      </span>
    </div>
  );
}
