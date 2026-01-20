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
<div
  style={{
    display: "flex",
    gap: 28,
    fontWeight: 500,
  }}
>
  <Link href="/Browse">Browse</Link>
  <Link href="/Sell">Sell</Link>
  <Link href="/Inbox">Inbox</Link>
  <Link href="/Login">Login</Link>
</div>
      </nav>
  );
}
