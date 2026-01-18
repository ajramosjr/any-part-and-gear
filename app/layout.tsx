import "./globals.css";
import Navbar from "./components/Navbar";
import { SITE_NAME } from "@/lib/constants";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
