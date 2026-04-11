// Streamline icons — sourced via Streamline API (heroicons-outline + lucide-line families)

export function SparklesIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-0.813 -2.846a4.5 4.5 0 0 0 -3.09 -3.09L2.25 12l2.846 -0.813a4.5 4.5 0 0 0 3.09 -3.09L9 5.25l0.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846 0.813a4.5 4.5 0 0 0 -3.09 3.09Zm8.446 -7.189L18 9.75l-0.259 -1.035a3.375 3.375 0 0 0 -2.455 -2.456L14.25 6l1.036 -0.259a3.375 3.375 0 0 0 2.455 -2.456L18 2.25l0.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035 0.259a3.375 3.375 0 0 0 -2.456 2.456Zm-1.365 11.852L16.5 21.75l-0.394 -1.183a2.25 2.25 0 0 0 -1.423 -1.423L13.5 18.75l1.183 -0.394a2.25 2.25 0 0 0 1.423 -1.423l0.394 -1.183 0.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183 0.394 -1.183 0.394a2.25 2.25 0 0 0 -1.423 1.423Z" strokeWidth="1.5" />
    </svg>
  );
}

export function UsersIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625 0.372 9.337 9.337 0 0 0 4.121 -0.952 4.125 4.125 0 0 0 -7.533 -2.493M15 19.128v-0.003c0 -1.113 -0.285 -2.16 -0.786 -3.07M15 19.128v0.106A12.318 12.318 0 0 1 8.624 21c-2.331 0 -4.512 -0.645 -6.374 -1.766l-0.001 -0.109a6.375 6.375 0 0 1 11.964 -3.07M12 6.375a3.375 3.375 0 1 1 -6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1 -5.25 0 2.625 2.625 0 0 1 5.25 0Z" strokeWidth="1.5" />
    </svg>
  );
}

export function VideoCameraIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72 -4.72a0.75 0.75 0 0 1 1.28 0.53v11.38a0.75 0.75 0 0 1 -1.28 0.53l-4.72 -4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25 -2.25v-9a2.25 2.25 0 0 0 -2.25 -2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" strokeWidth="1.5" />
    </svg>
  );
}

export function LeafIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5 -4.78 10 -10 10Z" strokeWidth="1.5" />
      <path d="M2 21c0 -3 1.85 -5.36 5.08 -6C9.5 14.52 12 13 13 12" strokeWidth="1.5" />
    </svg>
  );
}

export function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 -2.485 -2.099 -4.5 -4.688 -4.5 -1.935 0 -3.597 1.126 -4.312 2.733 -0.715 -1.607 -2.377 -2.733 -4.313 -2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9 -4.78 9 -12Z" strokeWidth="1.5" />
    </svg>
  );
}

export function BoltIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5 -11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" strokeWidth="1.5" />
    </svg>
  );
}

// Bookmark solid — used in "Pinned" badge on posts
export function PinnedIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497 0.174 2.57 1.46 2.57 2.93V21a0.75 0.75 0 0 1 -1.085 0.67L12 18.089l-7.165 3.583A0.75 0.75 0 0 1 3.75 21V5.507c0 -1.47 1.073 -2.756 2.57 -2.93Z" clipRule="evenodd" />
    </svg>
  );
}

// Thumbtack / Pin (Lucide) — used for admin "pin post" action (inactive)
export function MapPinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m12 17 0 5" strokeWidth="1.5" />
      <path d="M5 17h14v-1.76a2 2 0 0 0 -1.11 -1.79l-1.78 -0.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0 -4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1 -1.11 1.79l-1.78 0.9A2 2 0 0 0 5 15.24Z" strokeWidth="1.5" />
    </svg>
  );
}

// Thumbtack filled — used for admin "pin post" action (active/pinned)
export function MapPinSolidIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m12 17 0 5" strokeWidth="1.5" fill="none" />
      <path d="M5 17h14v-1.76a2 2 0 0 0 -1.11 -1.79l-1.78 -0.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0 -4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1 -1.11 1.79l-1.78 0.9A2 2 0 0 0 5 15.24Z" strokeWidth="1.5" />
    </svg>
  );
}

// Arrow Right — for CTA buttons
export function ArrowRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0 -7.5 7.5M21 12H3" strokeWidth="1.5" />
    </svg>
  );
}

// Arrow Top Right on Square — for "view post" link
export function ArrowTopRightIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" strokeWidth="1.5" />
    </svg>
  );
}

// Share — for sharing posts
export function ShareIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0 -2.186c0.18 0.324 0.283 0.696 0.283 1.093s-0.103 0.77 -0.283 1.093m0 -2.186 9.566 -5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0 -3.935 -2.186Zm0 -12.814a2.25 2.25 0 1 0 3.933 -2.185 2.25 2.25 0 0 0 -3.933 2.185Z" strokeWidth="1.5" />
    </svg>
  );
}

export function ChatBubbleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087 0.16 2.185 0.283 3.293 0.369V21l4.076 -4.076a1.526 1.526 0 0 1 1.037 -0.443 48.282 48.282 0 0 0 5.68 -0.494c1.584 -0.233 2.707 -1.626 2.707 -3.228V6.741c0 -1.602 -1.123 -2.995 -2.707 -3.228A48.394 48.394 0 0 0 12 3c-2.392 0 -4.744 0.175 -7.043 0.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" strokeWidth="1.5" />
    </svg>
  );
}
