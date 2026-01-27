"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  image_url: string | null;
  created_at: string;
};

export default function MyListingsPage() {
  const supabase = createClient();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyParts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("parts")
        .select("id, title, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setParts(data || []);
      setLoading(false);
    };

    fetchMyParts();
  }, [supabase]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {loading && <p>Loading…</p>}

      {!loading && parts.length === 0 && (
        <p className="text-gray-500">You haven’t listed anything yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {parts.map((part) => (
          <div key={part.id} className="border rounded-lg p-4">
            <Image
              src={part.image_url || "/images/apg-placeholder.png"}
              alt={part.title}
              width={400}
              height={300}
              className="rounded mb-3"
            />

            <h3 className="font-semibold">{part.title}</h3>
          </div>
        ))}
      </div>
    </main>
  );
}
