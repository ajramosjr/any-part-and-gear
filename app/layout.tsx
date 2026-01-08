import "./globals.css";
import ToasterClient from "@/app/ui/toaster-client";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToasterClient />

        {/* Global Navigation */}
        <nav style={{ padding: 16, borderBottom: "1px solid #444" }}>
          <Link href="/browse" style={{ marginRight: 16 }}>
            Browse
          </Link>
          <Link href="/sell" style={{ marginRight: 16 }}>
            Sell
          </Link>
          <Link href="/my-listings">
            My Listings
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}
