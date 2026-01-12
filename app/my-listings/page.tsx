"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function MyListings() {
  const supabase = createClient(); // ✅ MUST be inside component

  const [user, setUser] = useState<any>(null);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("user_id", user.id);

      if (mounted) {
        setParts(data ?? []);
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [supabase]);

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
