function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-warm-200 ${className ?? ""}`}
    />
  );
}

function MessageSkeleton() {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-2.5 w-full max-w-xs" />
        </div>
        <Shimmer className="h-3 w-12" />
      </div>
    </div>
  );
}

export default function InboxLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Shimmer className="h-7 w-24" />
        <div className="mt-4 flex gap-4 border-b border-warm-200 pb-2">
          <Shimmer className="h-5 w-16" />
          <Shimmer className="h-5 w-20" />
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <MessageSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
