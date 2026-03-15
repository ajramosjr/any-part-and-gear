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
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {

    const loadProfile = async () => {

      const { data: partsData } = await supabase
        .from("parts")
        .select("id,title,price")
        .eq("user_id", userId);

      if (partsData) setParts(partsData);

      const { data: ratingData } = await supabase
        .from("ratings")
        .select("rating")
        .eq("seller_id", userId);

      if (ratingData && ratingData.length > 0) {

        const avg =
          ratingData.reduce((sum, r) => sum + r.rating, 0) /
          ratingData.length;

        setRating(avg);
      }

    };

    loadProfile();

  }, [userId]);

  return (

    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-2">
        Seller Profile
      </h1>

      {rating && (
        <p className="text-yellow-500 mb-6">
          ⭐ {rating.toFixed(1)} Seller Rating
        </p>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Seller Listings
      </h2>

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

          <p className="font-semibold">
            {part.title}
          </p>

          {part.price && (
            <p className="text-green-600">
              ${part.price}
            </p>
          )}

        </Link>

      ))}

    </main>

  );
}     
