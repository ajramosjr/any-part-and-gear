import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Any-Part and Gear",
  description: "Buy, sell, and trade auto parts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              textDecoration: "none",
            }}
          >
            Any-Part and Gear
          </Link>

          <nav style={{ display: "flex", gap: "16px" }}>
            <Link href="/browse">Browse</Link>
            <Link href="/sell">Sell</Link>
            <Link href="/login">Login</Link>
            <Link href="/inbox" style={{ marginLeft: 16 }}>
  Inbox
</Link>
          </nav>
        </header>

        {/* Page Content */}
        <main
          style={{
            background: "#f9fafb",
            minHeight: "100vh",
            padding: "32px 24px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
