import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900">
          Find Rare Parts & Trusted Sellers
        </h1>

        
<p className="text-gray-500 mt-2">
  Powered by{" "}
  <Link
    href="/apg-xlink"
    className="text-blue-600 hover:underline font-semibold"
  >
    A.P.G X-Link
  </Link>
</p>
        <div className="flex mt-6 justify-center">
          <input
            type="text"
            placeholder="Search parts, vehicles, or gear..."
            className="border p-3 w-96 rounded-l-lg"
          />
          <button className="bg-yellow-500 text-white px-6 rounded-r-lg">
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

  <Link href="/category/cars" className="border rounded-lg p-6 text-center hover:shadow block">
    🚗 Cars
  </Link>

  <Link href="/category/boats" className="border rounded-lg p-6 text-center hover:shadow block">
    🚤 Boats
  </Link>

  <Link href="/category/marine" className="border rounded-lg p-6 text-center hover:shadow block">
    ⚓ Marine
  </Link>

  <Link href="/category/tools" className="border rounded-lg p-6 text-center hover:shadow block">
    🛠 Tools
  </Link>

  <Link href="/category/machinery" className="border rounded-lg p-6 text-center hover:shadow block">
    🏗 Machinery
  </Link>

  <Link href="/category/rc" className="border rounded-lg p-6 text-center hover:shadow block">
    🏎 RC Vehicles
  </Link>

  <Link href="/category/rv" className="border rounded-lg p-6 text-center hover:shadow block">
    🚐 RV Vehicles
  </Link>

  <Link href="/category/buses" className="border rounded-lg p-6 text-center hover:shadow block">
    🚌 Buses
  </Link>

</div>
      {/* AI Vehicle Scan */}
      <section className="mt-14 mb-12">

        <div className="bg-blue-900 text-white rounded-2xl p-10 text-center">

          <h2 className="text-3xl font-bold mb-3">
            Scan Your Vehicle With AI
          </h2>

          <p className="text-gray-200 mb-6">
            Take a photo of your car, boat, or RC vehicle and instantly discover
            compatible parts, maintenance tips, and upgrade ideas.
          </p>

          <a
            href="/ai-scan"
            className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400"
          >
            Scan Your Vehicle
          </a>

        </div>

      </section>

      {/* Trending Parts */}
      <h2 className="text-2xl font-bold mb-4">
        🔥 Trending Parts
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <div className="border rounded-xl p-4 hover:shadow-lg transition">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Ford F150 Headlights</h3>
          <p className="text-gray-500">$140</p>
        </div>

        <div className="border rounded-xl p-4 hover:shadow-lg transition">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Chevy Silverado Tailgate</h3>
          <p className="text-gray-500">$300</p>
        </div>

        <div className="border rounded-xl p-4 hover:shadow-lg transition">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Yamaha Jet Ski Pump</h3>
          <p className="text-gray-500">$180</p>
        </div>

        <div className="border rounded-xl p-4 hover:shadow-lg transition">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Traxxas RC Motor</h3>
          <p className="text-gray-500">$90</p>
        </div>

      </div>

      {/* Featured Listings */}
      <h2 className="text-2xl font-semibold mb-4">Featured Listings</h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="border rounded-lg p-4 hover:shadow">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Ford Mustang GT Exhaust</h3>
          <p className="text-gray-500">$250</p>
        </div>

        <div className="border rounded-lg p-4 hover:shadow">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Yamaha Boat Propeller</h3>
          <p className="text-gray-500">$180</p>
        </div>

        <div className="border rounded-lg p-4 hover:shadow">
          <img src="/placeholder.png" className="rounded mb-3" />
          <h3 className="font-semibold">Traxxas RC Engine</h3>
          <p className="text-gray-500">$120</p>
        </div>

      </div>

    </main>
  );
}
