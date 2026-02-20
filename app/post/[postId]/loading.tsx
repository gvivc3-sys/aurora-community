function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-warm-200 ${className ?? ""}`}
    />
  );
}

export default function PostLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Shimmer className="h-4 w-28" />
        <div className="mt-6 overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 pt-4">
            <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-2.5 w-16" />
            </div>
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>
          <div className="mt-3 space-y-2 px-4">
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
            <Shimmer className="h-3 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
          </div>
          <div className="mx-4 mt-3 border-t border-warm-100" />
          <div className="flex gap-4 px-4 py-3">
            <Shimmer className="h-5 w-12" />
            <Shimmer className="h-5 w-12" />
            <Shimmer className="h-5 w-12" />
          </div>
          {/* Comment skeletons */}
          <div className="border-t border-warm-100 px-4 pb-4 pt-3">
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Shimmer className="h-3 w-32" />
                    <Shimmer className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
