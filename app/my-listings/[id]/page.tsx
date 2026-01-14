"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // ✅ correct

export default function EditListing() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("title")
        .eq("id", id)
        .single();

      if (data) setTitle(data.title);
      setLoading(false);
    };

    fetchPart();
  }, [id]);

  async function updatePart() {
    await supabase.from("parts").update({ title }).eq("id", id);
    alert("Updated!");
  }

  async function deletePart() {
    if (!confirm("Delete this listing?")) return;

    await supabase.from("parts").delete().eq("id", id);
    router.push("/my-listings");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Edit Listing</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={updatePart}>Save</button>
      <button onClick={deletePart}>Delete</button>
    </div>
  );
}
