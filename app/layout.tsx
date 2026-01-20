import "./globals.css";
import Image from "next/image";

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
        {/* BODY LOGO */}
        <div className="w-full flex justify-center mt-10 mb-6">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-lg">
            <Image
              src="/logo.png"
              alt="Any-Part & Gear LLC"
              width={260}
              height={80}
              priority
            />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="max-w-7xl mx-auto px-4 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
