"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
  image_url: string | null;
  user_id: string;
};

export default function PartsPage() {

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchParts = async () => {

      const { data, error } = await supabase
        .from("parts")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();

  }, []);

  if (loading) {
    return <p className="p-6">Loading parts...</p>;
  }

  return (

    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Browse Parts
      </h1>

      {parts.length === 0 && (
        <p className="text-gray-500">
          No parts listed yet.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {parts.map((part) => (

          <div
            key={part.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >

            {part.image_url && (
              <Image
                src={part.image_url}
                alt={part.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">

              <h2 className="font-semibold text-lg mb-2">
                {part.title}
              </h2>

              {part.price && (
                <p className="text-green-600 font-medium mb-2">
                  ${part.price}
                </p>
              )}

              {part.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {part.description}
                </p>
              )}

              <div className="flex flex-col gap-2">

                <Link
                  href={`/parts/${part.id}`}
                  className="text-blue-600 font-medium"
                >
                  View Part
                </Link>

                <Link
                  href={`/user/${part.user_id}`}
                  className="text-sm text-gray-500"
                >
                  View Seller Profile
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>

  );
}
