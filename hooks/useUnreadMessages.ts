"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let channel: any;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Initial unread count
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setCount(count ?? 0);

      // Real-time updates
      channel = supabase
        .channel("unread-messages")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          async () => {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("receiver_id", user.id)
              .eq("read", false);

            setCount(count ?? 0);
          }
        )
        .subscribe();
    };

    load();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
