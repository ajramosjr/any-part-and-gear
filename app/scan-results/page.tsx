"use client";

import { useSearchParams } from "next/navigation";
import ApgXLink from "@/components/ApgXLink";

export default function ScanResults() {
  const params = useSearchParams();
  const vehicle = params.get("vehicle");

  const suggestedParts = [
    "Headlights",
    "Front Bumper",
    "Brake Pads",
    "Air Filter",
  ];

  return (
    <main className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Scan Results
      </h1>

      <p className="text-gray-600 mb-8">
        Vehicle detected: <strong>{vehicle}</strong>
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Suggested Parts
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {suggestedParts.map((part) => (
          <div
            key={part}
            className="border rounded-xl p-6 hover:shadow"
          >
            <h3 className="text-lg font-semibold mb-2">
              {vehicle} {part}
            </h3>

            <p className="text-gray-500 mb-4">
              Check listings or compare prices.
            </p>

            <ApgXLink part={`${vehicle} ${part}`} />

          </div>
        ))}

      </div>

    </main>
  );
}
