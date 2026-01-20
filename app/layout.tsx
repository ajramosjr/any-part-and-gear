export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* HERO / LOGO SECTION */}
      <div className="mt-12 mb-10 flex flex-col items-center">
        <img
          src="/apg-logo.png"
          alt="Any-Part & Gear Logo"
          className="h-24 w-auto mb-4"
        />

        <h1 className="text-2xl font-semibold">
          Any-Part & Gear
        </h1>

        <p className="mt-1 text-gray-600">
          Buy, sell, and trade auto parts
        </p>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-7xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-left">
          Latest Parts
        </h2>

        {/* Parts grid goes here */}
      </div>
    </div>
  );
}
