"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Part = {
  id: string;
  title: string;
  description: string;
};

export default function BrowsePage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("id, title, description")
        .order("id", { ascending: false });

      if (!error && data) {
        setParts(data);
      }

      setLoading(false);
    };

    fetchParts();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading parts…</p>;
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Browse Parts</h1>

      {parts.length === 0 && <p>No parts listed yet.</p>}

      {parts.map((part) => (
  <div
  key={part.id}
  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between"
>
  {/* Part info */}
  <div>
    <h3 className="text-lg font-semibold text-white">
      {part.title}
    </h3>

    <p className="text-sm text-zinc-400 mt-1">
      {part.description}
    </p>

    <p className="text-sm text-zinc-500 mt-1">
      Fits: {part.vehicle_year} {part.vehicle_make} {part.vehicle_model}
    </p>

    <p className="text-green-400 font-bold mt-2">
      ${part.price}
    </p>
  </div>

  {/* Actions */}
  <div className="flex gap-2 mt-4">
    <a
      href={`/seller/${part.seller_id}`}
      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded"
    >
      Message Seller
    </a>

    <button
      onClick={async () => {
        await supabase.from("parts").delete().eq("id", part.id);
        window.location.reload();
      }}
      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded"
    >
      Delete
    </button>
  </div>
</div>
