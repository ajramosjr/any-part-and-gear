"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function SellClient() {
  const [title, setTitle] = useState("");

  return (
    <form>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part title"
      />
      <button type="submit">Post</button>
    </form>
  );
}
