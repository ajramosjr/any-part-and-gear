"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

export default function MyListingsPage() {
  const [parts, setParts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setParts(data || []);
    };

    load();
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 40 }}>
        <h1>My Listings</h1>

        {parts.length === 0 && <p>No listings yet.</p>}

        {parts.map((part) => (
          <div key={part.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
            <h3>{part.title}</h3>
            <p>{part.description}</p>
            <strong>${part.price}</strong>
          </div>
        ))}
      </main>
    </RequireAuth>
  );
}
