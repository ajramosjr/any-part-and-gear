  export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900">
          Find Rare Parts & Trusted Sellers
        </h1>

        <p className="text-gray-500 mt-2">
          Powered by A.P.G X-Link
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

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🚗 Cars
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🚤 Boats
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          ⚓ Marine
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🛠 Tools
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🏗 Machinery
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🏎 RC Vehicles
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🚐 RV Vehicles
        </div>

        <div className="border rounded-lg p-6 text-center hover:shadow">
          🚌 Buses
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
