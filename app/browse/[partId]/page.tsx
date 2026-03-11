"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number | null;
  images: string[] | null;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  const [supabase] = useState(() => createClient());

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    const fetchParts = async () => {
      let request = supabase
        .from("parts")
        .select("id, title, price, images")
        .order("created_at", { ascending: false });

      if (query && query.trim() !== "") {
        request = request.ilike("title", `%${query.trim()}%`);
      }

      const { data, error } = await request;

      if (error) {
        console.error("Error loading parts:", error);
      } else {
        setParts(data ?? []);
      }

      setLoading(false);
    };

    fetchParts();
  }, [query, supabase]);

  if (loading) {
    return <p className="p-6">Loading parts…</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Parts</h1>

      {parts.length === 0 && (
        <p className="text-gray-500">
          {query ? `No parts found for "${query}".` : "No
