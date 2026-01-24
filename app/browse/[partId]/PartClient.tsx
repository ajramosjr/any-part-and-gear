"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

type Part = {
  id: string;
  title: string;
  description: string;
  price: number;
  condition?: string;
};

export default function PartClient({ partId }: { partId: string }) {
  const supabase = createSupabaseBrowser();

  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error) {
        setPart(data);
      }

      setLoading(false);
    };

    loadPart();
  }, [partId, supabase]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

  if (!part) {
    return <div className="p-6 text-red-500">Part not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{part.title}</h1>
      <p className="text-gray-300 mb-6">{part.description}</p>
      <div className="text-xl font-semibold">${part.price}</div>
      {part.condition && (
        <div className="text-sm text-gray-400 mt-2">
          Condition: {part.condition}
        </div>
      )}
    </div>
  );
}
