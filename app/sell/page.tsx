"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SellPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  if (!user) {
    return <p>Please log in to sell items.</p>;
  }

  return (
    <div>
      <h1>Sell a Part</h1>
      {/* form goes here */}
    </div>
  );
}
