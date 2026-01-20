import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* NAV BAR */}
        <header className="nav">
          <Link href="/" className="nav-logo">
            Any-Part & Gear
          </Link>

          <nav className="nav-links">
            <Link href="/browse">Browse</Link>
            <Link href="/sell">Sell</Link>
            <Link href="/inbox">Inbox</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
