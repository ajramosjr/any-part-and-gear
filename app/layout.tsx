import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Any-Part & Gear",
  description: "Buy, sell, and trade auto parts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* NAVBAR */}
        <header className="bg-white border-b">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* LEFT: BRAND */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight whitespace-nowrap"
            >
              Any-Part & Gear
            </Link>

            {/* RIGHT: NAV LINKS */}
            <div className="flex items-center space-x-5 whitespace-nowrap">
              <Link
                href="/browse"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Browse
              </Link>

              <Link
                href="/sell"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Sell
              </Link>

              <Link
                href="/inbox"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Inbox
              </Link>

              <Link
                href="/login"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-7xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
