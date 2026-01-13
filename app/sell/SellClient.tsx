"use client";

import { supabase } from "@/lib/supabaseClient";

export default function SellClient() {
  async function handleTest() {
    await supabase.from("parts").insert({
      title: "Test Part",
    });
  }

  return (
    <div>
      <h1>Sell a Part</h1>
      <button onClick={handleTest}>Test Insert</button>
    </div>
  );
}
