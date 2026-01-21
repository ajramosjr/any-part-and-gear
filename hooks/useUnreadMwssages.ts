"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setCount(count || 0);
    };

    loadUnread();
  }, []);

  return count;
}
