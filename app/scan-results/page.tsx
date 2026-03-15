"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";

export default function ScanResultsPage() {
  const searchParams = useSearchParams();

  const vehicle = searchParams.get("vehicle");
  const part = searchParams.get("part");
  const condition = searchParams.get("condition");
  const confidence = searchParams.get("confidence");
  const image = searchParams.get("image");

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Scan Results
      </h1>

      {image && (
        <img
          src={image}
          className="rounded-lg mb-6 w-full max-h-[400px] object-cover"
        />
      )}

      <div className="bg-gray-100 p-6 rounded-lg mb-6">

        <p className="text-lg mb-2">
          <strong>Vehicle:</strong> {vehicle || "Unknown"}
        </p>

        <p className="text-lg mb-2">
          <strong>Detected Part:</strong> {part || "Unknown"}
        </p>

        <p className="text-lg mb-2">
          <strong>Condition:</strong> {condition || "Unknown"}
        </p>

        <p className="text-lg">
          <strong>AI Confidence:</strong>{" "}
          {confidence ? `${Math.round(Number(confidence) * 100)}%` : "N/A"}
        </p>

      </div>

      <div className="flex gap-4">

        <a
          href="/sell"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Sell This Part
        </a>

        <a
          href="/"
          className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Back Home
        </a>

      </div>

    </main>
  );
}
