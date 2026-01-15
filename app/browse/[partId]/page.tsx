"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PartCard from "@/components/PartCard";

export default function PartDetailPage() {
  const { partId } = useParams();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partId) return;

    async function fetchPart() {
      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .eq("id", partId)
        .single();

      if (!error) {
        setPart(data);
      }

      setLoading(false);
    }

    fetchPart();
  }, [partId]);

  if (loading) {
    return <p className="p-6">Loading part…</p>;
  }

  if (!part) {
    return <p className="p-6">Part not found</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <PartCard part={part} />
    </main>
  );
}
