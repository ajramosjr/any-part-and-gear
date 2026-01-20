import Image from "next/image";

export default function HomePage() {
  return (
    <main className="container">
      
      {/* HERO / BRAND SECTION */}
      <section className="hero">
        <Image
          src="/logo.png"
          alt="Any-Part & Gear Logo"
          width={240}
          height={120}
          priority
          className="hero-logo"
        />

        <h1>A Marketplace to Buy, Sell, and Trade parts</h1>

        <p>
          Find new and used auto parts from trusted sellers
        </p>
      </section>

      {/* CONTENT */}
      <section>
        <h2>Latest Parts</h2>
      </section>

    </main>
  );
}
