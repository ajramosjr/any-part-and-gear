"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function PartClient({ partId }: { partId: string }) {
  const [part, setPart] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("parts")
      .select("*")
      .eq("id", partId)
      .single()
      .then(({ data }) => setPart(data));
  }, [partId]);

  if (!part) return <p>Loading...</p>;

  return (
    <div>
      <h1>{part.title}</h1>
      <p>{part.description}</p>
    </div>
  );
}
