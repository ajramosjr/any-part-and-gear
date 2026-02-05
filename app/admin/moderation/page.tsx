"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type ReportedPart = {
  id: number;
  title: string;
  description: string;
  reported_reason: string | null;
  created_at: string;
};

export default function ModerationPage() {
  const supabase = createClient();

  const [parts, setParts] = useState<ReportedPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select(`
          id,
          title,
          description,
          reported_reason,
          created_at
        `)
        .not("reported_reason", "is", null)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchReportedParts();
  }, [supabase]);

  if (loading) {
    return <p className="p-6">Loading moderation queue…</p>;
  }

  return (
    <RequireAuth>
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Moderation
        </h1>

        {parts.length === 0 && (
          <p className="text-gray-500">
            No reported listings.
          </p>
        )}

        <div className="space-y-4">
          {parts.map((part) => (
            <div
              key={part.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-semibold text-lg">
                {part.title}
              </h3>

              <p className="text-sm text-gray-700 mt-1">
                {part.description}
              </p>

              <p className="text-sm text-red-600 mt-2">
                Report reason: {part.reported_reason}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(part.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </RequireAuth>
  );
}
