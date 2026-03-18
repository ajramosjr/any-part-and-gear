"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type ScanResult = {
  vehicle: string;
  part: string;
  condition: string;
  confidence: number;
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-green-100 text-green-800",
  "like-new": "bg-blue-100 text-blue-800",
  used: "bg-yellow-100 text-yellow-800",
  "for-parts": "bg-red-100 text-red-800",
};

export default function AIScanPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setResult(null);
    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  }

  async function scanVehicle() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/vehicle-scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Scan failed. Please try again.");
        return;
      }

      setResult(data as ScanResult);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  const conditionClass =
    CONDITION_COLORS[result?.condition?.toLowerCase() ?? ""] ??
    "bg-gray-100 text-gray-700";

  const confidencePct = result
    ? Math.round(result.confidence * 100)
    : 0;

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🤖</div>
        <h1 className="text-3xl font-bold text-blue-900">AI Vehicle Scan</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Take or upload a photo to identify your vehicle and parts instantly.
        </p>
      </div>

      {/* Image picker */}
      {!result && (
        <div className="space-y-4">
          {/* Preview */}
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected image"
                className="w-full object-cover max-h-72"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 shadow text-sm leading-none"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-gray-600 font-medium mb-1">
                Upload a vehicle or part photo
              </p>
              <p className="text-gray-400 text-xs">
                JPEG, PNG, WebP — up to 10 MB
              </p>
            </div>
          )}

          {/* Upload buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Take photo (mobile camera) */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-700 rounded-xl py-3 font-semibold hover:bg-blue-50 active:bg-blue-100 transition"
            >
              📸 Take Photo
            </button>
            {/* Hidden camera input — opens camera on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload from gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-50 active:bg-gray-100 transition"
            >
              🖼 Upload Photo
            </button>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          {/* Scan button */}
          <button
            onClick={scanVehicle}
            disabled={!file || loading}
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-40 hover:bg-blue-800 active:bg-blue-950 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              "🔍 Scan with AI"
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Scanned vehicle"
                className="w-full object-cover max-h-56"
              />
            </div>
          )}

          {/* Result card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-4 py-3 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="font-semibold">Scan Complete</span>
              <span className="ml-auto text-blue-200 text-sm">
                {confidencePct}% confidence
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Vehicle
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {result.vehicle}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Detected Part
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {result.part}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                    Condition
                  </p>
                  <span
                    className={`inline-block text-sm font-semibold px-3 py-1 rounded-full capitalize ${conditionClass}`}
                  >
                    {result.condition}
                  </span>
                </div>

                <div className="ml-auto">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                    AI Confidence
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${confidencePct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {confidencePct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/browse?search=${encodeURIComponent(result.part)}`}
              className="bg-blue-600 text-white rounded-xl py-3 font-semibold text-center hover:bg-blue-700 active:bg-blue-800 transition"
            >
              🔎 Find This Part
            </Link>

            <Link
              href={`/sell?title=${encodeURIComponent(result.part)}&vehicle=${encodeURIComponent(result.vehicle)}&condition=${encodeURIComponent(result.condition)}`}
              className="bg-green-600 text-white rounded-xl py-3 font-semibold text-center hover:bg-green-700 active:bg-green-800 transition"
            >
              💰 Sell This Part
            </Link>
          </div>

          <button
            onClick={reset}
            className="w-full border border-gray-300 text-gray-600 rounded-xl py-3 font-semibold hover:bg-gray-50 active:bg-gray-100 transition"
          >
            ↩ Scan Another Image
          </button>
        </div>
      )}

      {/* Info footer */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Powered by OpenAI GPT-4o Vision · Any Part &amp; Gear
      </p>
    </main>
  );
}
