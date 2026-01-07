"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const [title, setTitle] = useState("");

  async function handleSubmit() {
    await supabase.from("listings").insert({ title });
  }

  return (
    <button onClick={handleSubmit}>Submit</button>
  );
}
