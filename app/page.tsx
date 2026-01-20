import Image from "next/image";

export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
      }}
    >
      {/* LOGO + TAGLINE */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <img
          src="/apg-logo.png"
          alt="Any-Part & Gear Logo"
          style={{
            height: 90,
            width: "auto",
            marginBottom: 12,
          }}
        />

        <p style={{ color: "#4b5563" }}>
          Buy, sell, and trade auto parts
        </p>
      </div>

      {/* CONTENT */}
      <div style={{ width: "100%", maxWidth: 1100, padding: "0 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
          Latest Parts
        </h2>

        {/* Parts grid goes here */}
      </div>
    </main>
  );
}
