function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-warm-200 ${className ?? ""}`}
    />
  );
}

function PostSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border-b-8 border-background bg-white last:border-b-0 sm:border sm:border-warm-200 sm:shadow-sm">
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
        <Shimmer className="h-3 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
      </div>
      <div className="mx-4 mt-3 border-t border-warm-100" />
      <div className="flex gap-4 px-4 py-3">
        <Shimmer className="h-5 w-12" />
        <Shimmer className="h-5 w-12" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="mx-auto max-w-3xl px-3 pb-24 pt-3 sm:px-6 sm:pb-24 sm:pt-4 md:pb-12">
        {/* Welcome card */}
        <div className="rounded-xl border border-warm-200 bg-white p-5 shadow-sm">
          <Shimmer className="h-4 w-40" />
          <div className="mt-3 space-y-2">
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-5/6" />
            <Shimmer className="h-3 w-2/3" />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Shimmer className="h-8 w-24 rounded-lg" />
            <Shimmer className="h-8 w-24 rounded-lg" />
          </div>
          <Shimmer className="h-8 w-28 rounded-full" />
        </div>

        <div className="mt-6 space-y-0 sm:space-y-6">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
