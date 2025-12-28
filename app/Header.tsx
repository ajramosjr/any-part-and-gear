import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Image
          src="/logo.png"
          alt="Any-Part & Gear Logo"
          width={48}
          height={48}
        />
        <strong>Any-Part & Gear</strong>
      </Link>

      <nav style={{ display: "flex", gap: "20px" }}>
        <Link href="/browse">Browse Parts</Link>
        <Link href="/sell">Sell / Trade</Link>
        <Link href="/login">Sign In</Link>
      </nav>
    </Header>
  );
}
