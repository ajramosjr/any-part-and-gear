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
