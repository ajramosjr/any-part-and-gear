import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* HERO / PAGE HEADER */}
      <div className="text-center mt-10">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-md">
            <Image
              src="/logo.png"
              alt="Any-Part & Gear LLC"
              width={260}
              height={80}
              priority
            />
          </div>
        </div>

        <p className="text-gray-600 text-lg">
          Buy, sell, and trade auto parts
        </p>
      </div>

      {/* LATEST PARTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Parts</h2>

        {/* Your existing parts grid stays below */}
      </section>
    </div>
  );
}
