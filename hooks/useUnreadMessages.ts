import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

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

      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("read", false);

      setCount(count || 0);
    };

    loadUnread();
  }, []);

  return count;
}
