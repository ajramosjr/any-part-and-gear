export default function VehiclePartsPage({ params }) {
  const vehicle = params.vehicle.replace(/-/g, " ");

  return (
    <main className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">
        Parts for {vehicle}
      </h1>

      <p className="text-gray-500 mb-6">
        Browse compatible parts and local listings for {vehicle}.
      </p>

    </main>
  );
}
