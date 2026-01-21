export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default function PurchaseSuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <main style={{ padding: 60, textAlign: "center" }}>
        <h1>Invalid Purchase</h1>
        <p>No session was found.</p>
      </main>
    );
  }

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

      <p style={{ marginTop: 16, fontSize: 14, color: "#64748b" }}>
        Order reference: <strong>{sessionId}</strong>
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: 32,
          padding: "12px 20px",
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Go Home
      </a>
    </main>
  );
}
