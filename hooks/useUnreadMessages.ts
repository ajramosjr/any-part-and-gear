import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCount(0);
        return;
      }

      const { count: unread } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setCount(unread || 0);
    };

    loadUnread();
  }, []);

  return count;
}
