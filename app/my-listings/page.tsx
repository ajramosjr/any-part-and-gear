"use client";

import RequireAuth from "@/app/components/RequireAuth";

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <main style={{ padding: 40 }}>
        <h1>My Listings</h1>
        <p>Your posted parts will show here.</p>
      </main>
    </RequireAuth>
  );
}
