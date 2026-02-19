"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-playfair text-4xl font-bold text-warm-900">
        You&#39;re offline
      </h1>
      <p className="mt-4 max-w-md text-lg text-warm-600">
        It looks like you&#39;ve lost your internet connection. Please check
        your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 rounded-full bg-warm-800 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-700"
      >
        Try again
      </button>
    </main>
  );
}
