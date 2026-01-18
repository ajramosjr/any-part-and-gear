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
<h1>{SITE_NAME}</h1>
        Any-Part and Gear
        <Navbar />
        {children}
      </body>
    </html>
  );
}
