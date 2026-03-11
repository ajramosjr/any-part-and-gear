"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

type ReportedPart = {
  id: number;
  reason: string;
  created_at: string;
  parts: {
    id: number;
    title: string;
  }[] | null;
};

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportedPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(
          `
          id,
          reason,
          created_at,
          parts (
            id,
            title
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReports(data as ReportedPart[]);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  return (
    <RequireAuth>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Moderation</h1>

        {loading && <p>Loading reports…</p>}

        {!loading && reports.length === 0 && (
          <p>No reports found 🎉</p>
        )}

        <ul className="space-y-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="border rounded p-4 bg-white"
            >
              <p className="font-semibold">
                {report.parts?.[0]?.title ?? "Unknown Part"}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Reason: {report.reason}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Reported on{" "}
                {new Date(report.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </RequireAuth>
  );
}
