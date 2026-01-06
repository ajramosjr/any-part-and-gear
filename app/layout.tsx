import "./globals.css";
import ToasterClient from "@/app/ui/toaster-client";

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
