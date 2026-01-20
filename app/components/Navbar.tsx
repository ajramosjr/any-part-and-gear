"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Link href="/" style={{ fontWeight: 600 }}>
        Any-Part & Gear
      </Link>

      <div style={{ display: "flex", gap: 24 }}>
        <Link href="/browse">Browse</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/inbox">Inbox</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
