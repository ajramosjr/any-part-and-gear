"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Optional: verify purchase with API
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>✅ Purchase Successful</h1>

      {loading ? (
        <p>Finalizing your purchase…</p>
      ) : (
        <>
          <p style={{ marginTop: 12 }}>
            Thank you for your purchase! Your transaction has been completed
            successfully.
          </p>

          <div style={{ marginTop: 24 }}>
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
