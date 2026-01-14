"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function SellForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from("parts").insert({
      title: "Test Part",
    });

    if (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? "Posting..." : "Post Part"}
    </button>
  );
}
