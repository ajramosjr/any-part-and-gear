"use client";

import Link from "next/link";
import { useUnreadMessages } from "@/app/hooks/useUnreadMessages";

export default function NavBar() {
  const unread = useUnreadMessages();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {/* Left */}
      <Link
        href="/"
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#0f172a",
          textDecoration: "none",
        }}
      >
        Any-Part & Gear
      </Link>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          fontWeight: 500,
        }}
      >
        <Link href="/browse">Browse</Link>
        <Link href="/sell">Sell</Link>

        <Link href="/inbox" style={{ position: "relative" }}>
          Inbox
          {unread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -14,
                background: "#2563eb",
                color: "#fff",
                borderRadius: 999,
                padding: "2px 7px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {unread}
            </span>
          )}
        </Link>

        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
