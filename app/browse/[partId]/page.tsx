"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PartPage() {
  const { partId } = useParams();
  const [part, setPart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partId) return;

    const fetchPart = async () => {
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

    fetchPart();
  }, [partId]);

  if (loading) return <p>Loading...</p>;
  if (!part) return <p>Part not found</p>;

  return (
    <div>
      <h1>{part.title}</h1>
      <p>{part.description}</p>
      <p>Price: ${part.price}</p>
    </div>
  );
}
