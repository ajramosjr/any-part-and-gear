"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("parts")
        .select("id, title, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchMyParts();
  }, [supabase]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>

      {loading && <p>Loading…</p>}

      {!loading && parts.length === 0 && (
        <p className="text-gray-500">
          You haven’t listed anything yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parts.map((part) => {
          const imageSrc =
            part.image_url?.startsWith("http")
              ? part.image_url
              : "/logo.png";

          return (
            <div
              key={part.id}
              className="border rounded-lg p-4 flex flex-col hover:shadow transition"
            >
              <Image
                src={imageSrc}
                alt={part.title}
                width={400}
                height={300}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="rounded mb-3 object-contain bg-gray-50"
              />

              <h3 className="font-semibold mb-4">
                {part.title}
              </h3>

              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/parts/${part.id}`}
                  className="flex-1 border text-center px-4 py-2 rounded hover:bg-gray-50"
                >
                  View
                </Link>

                <Link
                  href={`/sell/${part.id}`}
                  className="flex-1 bg-slate-900 text-white text-center px-4 py-2 rounded hover:bg-slate-800"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
