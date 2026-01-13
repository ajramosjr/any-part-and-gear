"use client";

import { supabase } from "@/lib/supabaseClient";

export default function SellClient() {
  async function testInsert() {
    await supabase.from("parts").insert({
      title: "Test Part",
    });
  }

  return (
    <div>
      <h1>Sell a Part</h1>
      <button onClick={testInsert}>Test Insert</button>
    </div>
  );
}
