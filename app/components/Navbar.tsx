"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);

      setUnreadCount(count ?? 0);
    };

    load();
  }, []);

  return (
    <header
      style={{
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* LEFT */}
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: 20,
          textDecoration: "none",
          color: "#0f172a",
        }}
      >
        Any-Part & Gear
      </Link>

      {/* RIGHT */}
      <nav
        style={{
          display: "flex",
          gap: 28,
          alignItems: "center",
        }}
      >
        <Link href="/browse">Browse</Link>
        <Link href="/sell">Sell</Link>

        {userId && (
          <Link href="/inbox" style={{ position: "relative" }}>
            Inbox
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -12,
                  background: "#facc15",
                  color: "#0f172a",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 999,
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        {!userId && <Link href="/login">Login</Link>}
      </nav>
    </header>
  );
}
