"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SellClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const handleSubmit = async () => {
    await supabase.from("parts").insert({ title: "Test" });
  };
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p>Please log in to sell items.</p>;
  }

  return (
    <div>
      {/* your sell form here */}
    </div>
  );
}
