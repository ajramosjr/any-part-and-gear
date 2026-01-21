"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 🔹 Initial count
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setCount(count ?? 0);

      // 🔥 Realtime listener
      channel = supabase
        .channel("unread-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            setCount((c) => c + 1);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            // Recalculate on read
            supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("receiver_id", user.id)
              .eq("read", false)
              .then(({ count }) => setCount(count ?? 0));
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
