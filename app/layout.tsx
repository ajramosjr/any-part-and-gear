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
        {children}
      </body>
    </html>
  );
}
<Link href="/my-listings">My Listings</Link>
