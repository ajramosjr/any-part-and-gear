"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export function useUnreadMessages() {
  const supabase = createClient();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { count, error } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      if (!error && typeof count === "number") {
        setCount(count);
      }

      setLoading(false);
    };

    fetchUnreadCount();
  }, [supabase]);

  return { count, loading };
}
