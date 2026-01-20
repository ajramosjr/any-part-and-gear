import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Any-Part & Gear",
  description: "Buy, sell, and trade car & gear parts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {/* HEADER */}
        <header className="w-full border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center px-4 py-4">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo container */}
              <div className="bg-white rounded-xl px-4 py-2">
                <Image
                  src="/logo.png"
                  alt="Any-Part & Gear LLC"
                  width={200}
                  height={60}
                  priority
                />
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
