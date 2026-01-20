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
        <header className="border-b bg-white">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* LEFT SIDE */}
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              Any-Part & Gear
            </Link>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/browse"
                className="text-gray-700 hover:text-black"
              >
                Browse
              </Link>

              <Link
                href="/sell"
                className="text-gray-700 hover:text-black"
              >
                Sell
              </Link>

              <Link
                href="/login"
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
