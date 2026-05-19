'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main>
      <div className="container px-8 md:px-0 md:mx-auto space-y-2 py-10">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">Something went wrong</h2>
          <p className="text-gray-600">We encountered an error while loading your dashboard.</p>
          <button
            onClick={() => reset()}
            className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 w-fit"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
