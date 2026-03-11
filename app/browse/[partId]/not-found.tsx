import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        padding: 40,
        textAlign: "center",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>
        Part Not Found
      </h1>

      <p style={{ color: "#888", marginBottom: 30 }}>
        The part you’re looking for doesn’t exist or may have been sold or removed.
      </p>

      <Link
        href="/browse"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#000",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        Browse Parts
      </Link>
    </main>
  );
}
