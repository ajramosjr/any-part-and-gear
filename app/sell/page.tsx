"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SellPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (mounted) {
        setUser(data.user);
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (loading) {
    return <p>Loading…</p>;
  }

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
