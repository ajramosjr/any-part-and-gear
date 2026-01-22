export const dynamic = "force-dynamic";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PurchaseSuccessPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          textAlign: "center",
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <CheckCircle size={64} color="#16a34a" style={{ marginBottom: 16 }} />

        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
          Purchase Successful
        </h1>

        <p style={{ marginTop: 12, color: "#555" }}>
          Your payment was completed successfully.
          The seller has been notified and your order is now processing.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link
            href="/inbox"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              background: "#111827",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Go to Messages
          </Link>
        </div>
      </div>
    </main>
  );
}
