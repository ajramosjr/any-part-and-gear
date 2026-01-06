"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function EditListing() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");

  useEffect(() => {
    supabase
      .from("parts")
      .select("title")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setTitle(data.title);
      });
  }, [id]);

  async function updatePart() {
    await supabase
      .from("parts")
      .update({ title })
      .eq("id", id);

    alert("Updated!");
  }

  async function deletePart() {
    if (!confirm("Delete this listing?")) return;

    await supabase
      .from("parts")
      .delete()
      .eq("id", id);

    router.push("/my-listings");
  }

  return (
    <div>
      <h1>Edit Listing</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={updatePart}>Save</button>
      <button onClick={deletePart}>Delete</button>
    </div>
  );
}
