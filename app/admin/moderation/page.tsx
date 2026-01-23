"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

type ReportedPart = {
  id: number;
  title: string;
  description: string;
  reported: boolean;
};

export default function ModerationPage() {
  const supabase = createClient();

  const [parts, setParts] = useState<ReportedPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedParts = async () => {
      const { data } = await supabase
        .from("parts")
        .select("id, title, description, reported")
        .eq("reported", true)
        .order("created_at", { ascending: false });

      setParts(data || []);
      setLoading(false);
    };

    fetchReportedParts();
  }, []);

  const approvePart = async (id: number) => {
    await supabase
      .from("parts")
      .update({ reported: false })
      .eq("id", id);

    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return <p className="p-6">Loading moderation queue…</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Moderation</h1>

      {parts.length === 0 && (
        <p className="text-gray-500">No reported items 🎉</p>
      )}

      {parts.map((part) => (
        <div
          key={part.id}
          className="border rounded-lg p-4 mb-4"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{part.title}</h3>
            <VerifiedBadge />
          </div>

          <p className="mt-2 text-gray-700">{part.description}</p>

          <button
            onClick={() => approvePart(part.id)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </main>
  );
}
