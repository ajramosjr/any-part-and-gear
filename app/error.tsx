"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  console.error(error);

  return (
    <main className="p-6 text-center">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-gray-500 mt-2">
        Please refresh or try again later.
      </p>
    </main>
  );
}
