"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function SellClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!user) return <p>You must be logged in to sell.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Sell a Part</h1>
      {/* form goes here */}
    </div>
  );
}
