export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function BrowsePage() {
  const [parts, setParts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const filtered = parts.filter((part) => {
  if (category && part.category !== category) return false;
  return part.title?.toLowerCase().includes(search.toLowerCase());
});
  
  useEffect(() => {
    async function fetchParts() {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, image_url");

      if (error) {
        console.error(error);
      } else {
        setParts(data || []);
      }
    }

    fetchParts();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Browse Parts</h1>

      <input
        type="text"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, marginBottom: 20 }}
      />

      {parts
        .filter((part) =>
          part.title?.toLowerCase().includes(search.toLowerCase())
        )
        .map((part) => (
          <Link href={`/browse/${part.id}`} key={part.id}>
            <div
              style={{
                border: "1px solid #444",
                padding: 16,
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              <h3>{part.title}</h3>

              {part.image_url && (
                <img
                  src={part.image_url}
                  alt={part.title}
                  style={{ maxWidth: 200 }}
                />
              )}
            </div>
          </Link>
        ))}
    </main>
  );
}
