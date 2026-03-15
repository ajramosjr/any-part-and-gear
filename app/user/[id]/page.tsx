"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
};

export default function UserProfile() {

  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {

    const fetchParts = async () => {

      const { data } = await supabase
        .from("parts")
        .select("id,title,price")
        .eq("user_id", userId);

      if (data) setParts(data);

    };

    fetchParts();

  }, [userId]);

  return (

    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Seller Listings
      </h1>

      {parts.length === 0 && (
        <p className="text-gray-500">
          No listings yet.
        </p>
      )}

      {parts.map((part) => (

        <Link
          key={part.id}
          href={`/parts/${part.id}`}
          className="block border p-4 rounded mb-3"
        >
          <p className="font-semibold">{part.title}</p>

          {part.price && (
            <p className="text-green-600">${part.price}</p>
          )}

        </Link>

      ))}

    </main>
  );
}
