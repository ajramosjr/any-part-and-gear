import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "AnyPartandGear",
  description:
    "Buy, sell, and trade car, boat, and gear parts. Find rare parts and trusted sellers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8fafc" }}>
        <NavBar />

        <main
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
