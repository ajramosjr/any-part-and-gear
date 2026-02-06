"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/app/components/RequireAuth";
import { createClient } from "@/lib/supabaseClient";

type ReportedPart = {
  id: number;
  title: string;
  reason: string;
  created_at: string;
};

export default function ModerationPage() {
  const supabase = createClient();

  const [parts, setParts] = useState<ReportedPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedParts = async () => {
      const { data, error } = await supabase
        .from("reported_parts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchReportedParts();
  }, [supabase]);

  const deletePart = async (id: number) => {
    const confirmDelete = confirm("Delete this part permanently?");
    if (!confirmDelete) return;

    await supabase.from("parts").delete().eq("id", id);
    await supabase.from("reported_parts").delete().eq("id", id);

    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <RequireAuth>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Moderation Panel</h1>

        {loading && <p>Loading…</p>}

        {!loading && parts.length === 0 && (
          <p className="text-gray-500">No reported listings 🎉</p>
        )}

        <ul className="space-y-4">
          {parts.map((part) => (
            <li
              key={part.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{part.title}</p>
                <p className="text-sm text-gray-600">
                  Reason: {part.reason}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(part.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deletePart(part.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </RequireAuth>
  );
}
