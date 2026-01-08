"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function MyListings() {
  const [user, setUser] = useState<any>(null);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", user.id);

      setParts(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please sign in</p>;

  return (
    <main style={{ padding: 40 }}>
      <h1>My Listings</h1>

      {parts.length === 0 && <p>No listings yet</p>}

      {parts.map((part) => (
        <div key={part.id} style={{ marginBottom: 20 }}>
          <p>{part.title}</p>
          <Link href={`/my-listings/${part.id}`}>Edit / Delete</Link>
        </div>
      ))}
    </main>
  );
}
