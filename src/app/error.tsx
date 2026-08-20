"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Kuch ghalat ho gaya
        </h1>
        <p className="text-gray-500 mb-6">
          Koi unexpected error aa gaya. Don{"'"}t worry — neeche button se try
          kar sakte ho.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}