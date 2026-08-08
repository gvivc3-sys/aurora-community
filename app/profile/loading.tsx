function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-warm-200 ${className ?? ""}`}
    />
  );
}

export default function ProfileLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-xl px-2 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-6">
        <Shimmer className="h-4 w-16" />
        <Shimmer className="mt-6 h-7 w-32" />
        <Shimmer className="mt-1 h-4 w-48" />

        {/* Avatar card skeleton */}
        <div className="mt-8 rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
          <Shimmer className="h-4 w-24" />
          <div className="mt-4 flex items-center gap-5">
            <Shimmer className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Shimmer className="h-8 w-28 rounded-full" />
              <Shimmer className="h-3 w-36" />
            </div>
          </div>
        </div>

        {/* Info card skeleton */}
        <div className="mt-6 rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
          <Shimmer className="h-4 w-36" />
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-9 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
