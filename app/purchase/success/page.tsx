"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  return (
    <main
      style={{
        padding: 60,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>
        ✅ Purchase Successful
      </h1>

      <p style={{ fontSize: 16, color: "#475569" }}>
        Thank you for your purchase!
      </p>

      {sessionId && (
        <p style={{ marginTop: 16, fontSize: 14, color: "#64748b" }}>
          Order reference: <strong>{sessionId}</strong>
        </p>
      )}

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: 32,
          padding: "12px 20px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Go Home
      </button>
    </main>
  );
}
