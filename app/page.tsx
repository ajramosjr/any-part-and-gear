"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";


type Part = {
  id: number;
  title: string;
  price: number | null;
  images: string[] | null;
};

export default async function HomePage() {
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.from("parts").select("*").limit(5);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Any-Part & Gear
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parts.map((part) => (
          <Link
            key={part.id}
            href={`/parts/${part.id}`}
            className="border rounded-lg p-4 hover:shadow"
          >
            <Image
              src={part.images?.[0] || "/images/apg-placeholder.png"}
              alt={part.title}
              width={400}
              height={300}
              className="rounded mb-3"
            />
            <h3 className="font-semibold">{part.title}</h3>
            {part.price && <p>${part.price}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
