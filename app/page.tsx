import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* HERO SECTION */}
      <section className="text-center">
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="Any-Part & Gear"
          className="mx-auto h-32 w-auto mb-8"
        />

        {/* HEADLINE */}
        <h1 className="text-3xl font-bold text-[#0b1f3b] mb-4">
          A marketplace to buy, sell, and trade parts
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Find new and used auto parts from trusted sellers
        </p>

        {/* CTA BUTTONS */}
        <div className="flex justify-center gap-4">
          <Link
            href="/browse"
            className="bg-[#0b1f3b] text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            Browse Parts
          </Link>

          <Link
            href="/sell"
            className="border border-[#0b1f3b] text-[#0b1f3b] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Sell a Part
          </Link>
        </div>
      </section>

      {/* LATEST PARTS */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-2">Latest Parts</h2>
        <p className="text-gray-500">
          New listings will appear here.
        </p>
      </section>
    </main>
  );
}
