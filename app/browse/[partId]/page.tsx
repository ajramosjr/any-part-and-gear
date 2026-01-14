"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseBrowser";

export default function PartDetailPage() {
  const params = useParams();
  const id = params.partId as string;

  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      setPart(data);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!part) return <p style={{ padding: 40 }}>Part not found</p>;

  return (
    <main style={{ padding: 40 }}>
      <Link href="/browse">← Back</Link>
      <h1>{part.title}</h1>
      <p>{part.description}</p>
    </main>
  );
}
