"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <button
        className="rounded-md border px-4 py-2"
        type="button"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
