import Image from "next/image";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "40px 0 24px",
        }}
      >
        <Image
          src="/logo.png"
          alt="Any-Part & Gear Logo"
          width={220}
          height={120}
          style={{ margin: "0 auto", objectFit: "contain" }}
          priority
        />

        <p
          style={{
            marginTop: 12,
            fontSize: 18,
            color: "#555",
          }}
        >
          Buy, sell, and trade auto parts
        </p>
      </section>

      {/* CONTENT */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 26, marginBottom: 16 }}>
          Latest Parts
        </h2>
      </section>

    </main>
  );
}
