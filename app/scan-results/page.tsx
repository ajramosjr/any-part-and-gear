export const dynamic = "force-dynamic";

import Link from "next/link";

type Props = {
  searchParams: Promise<{
    vehicle?: string;
    part?: string;
    condition?: string;
    confidence?: string;
    image?: string;
  }>;
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-green-100 text-green-800",
  "like-new": "bg-blue-100 text-blue-800",
  used: "bg-yellow-100 text-yellow-800",
  "for-parts": "bg-red-100 text-red-800",
};

export default async function ScanResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const vehicle = params.vehicle ?? "Unknown";
  const part = params.part ?? "Unknown";
  const condition = params.condition ?? "Unknown";
  const confidence = params.confidence;
  const image = params.image;

  const conditionClass =
    CONDITION_COLORS[condition?.toLowerCase() ?? ""] ??
    "bg-gray-100 text-gray-700";
  const confidencePct = confidence
    ? Math.round(Number(confidence) * 100)
    : null;

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-3xl font-bold text-blue-900">Scan Results</h1>
      </div>

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          className="rounded-xl mb-6 w-full max-h-72 object-cover border border-gray-200"
          alt="Scanned vehicle"
        />
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
        <div className="bg-blue-900 text-white px-4 py-3 font-semibold flex items-center justify-between">
          <span>AI Identification</span>
          {confidencePct !== null && (
            <span className="text-blue-200 text-sm">{confidencePct}% confidence</span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Vehicle</p>
            <p className="text-lg font-bold text-gray-900">{vehicle}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Detected Part</p>
            <p className="text-lg font-bold text-gray-900">{part}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Condition</p>
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full capitalize ${conditionClass}`}>
              {condition}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/browse?search=${encodeURIComponent(part)}`}
          className="bg-blue-600 text-white rounded-xl py-3 font-semibold text-center hover:bg-blue-700 transition"
        >
          🔎 Find This Part
        </Link>

        <Link
          href={`/sell?title=${encodeURIComponent(part)}&vehicle=${encodeURIComponent(vehicle)}&condition=${encodeURIComponent(condition)}`}
          className="bg-green-600 text-white rounded-xl py-3 font-semibold text-center hover:bg-green-700 transition"
        >
          💰 Sell This Part
        </Link>
      </div>

      <div className="mt-3">
        <Link
          href="/ai-scan"
          className="block w-full border border-gray-300 text-gray-600 rounded-xl py-3 font-semibold text-center hover:bg-gray-50 transition"
        >
          ↩ Scan Another Image
        </Link>
      </div>
    </main>
  );
}
