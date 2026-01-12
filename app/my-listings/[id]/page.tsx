"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function EditListing() {
  const supabase = createClient(); // ✅ correct pattern
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPart = async () => {
      const { data, error } = await supabase
        .from("parts")
        .select("title")
        .eq("id", id)
        .single();

      if (!error && data) {
        setTitle(data.title);
      }

      setLoading(false);
    };

    fetchPart();
  }, [id, supabase]);

  async function updatePart() {
    const { error } = await supabase
      .from("parts")
      .update({ title })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Updated!");
  }

  async function deletePart() {
    if (!confirm("Delete this listing?")) return;

    const { error } = await supabase
      .from("parts")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/my-listings");
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Loading…</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Edit Listing</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 8, width: "100%", maxWidth: 400 }}
      />

      <div style={{ marginTop: 16 }}>
        <button onClick={updatePart}>Save</button>
        <button
          onClick={deletePart}
          style={{ marginLeft: 8, color: "red" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
