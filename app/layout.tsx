import NavBar from "@/app/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
