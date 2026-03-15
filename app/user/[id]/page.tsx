"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
};

export default function UserPage() {

  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {

    const loadListings = async () => {

      const { data } = await supabase
        .from("parts")
        .select("id,title,price")
        .eq("user_id", userId);

      if (data) setParts(data);

    };

    loadListings();

  }, [userId]);

  return (

    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Seller Listings
      </h1>

      {parts.map((part) => (

        <div key={part.id} className="border p-4 rounded mb-3">

          <p className="font-semibold">{part.title}</p>

          {part.price && (
            <p className="text-green-600">${part.price}</p>
          )}

        </div>

      ))}

    </main>
  );
}
