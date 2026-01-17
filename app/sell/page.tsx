"use client";

import RequireAuth from "@/app/components/RequireAuth";

export default function SellPage() {
  return (
    <RequireAuth>
      <main style={{ padding: 40 }}>
        <h1>Sell a Part</h1>
        <p>You are logged in and allowed to post.</p>
      </main>
    </RequireAuth>
  );
}
