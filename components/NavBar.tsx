import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Any Part & Gear"
            width={200}
            height={80}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-700 font-medium items-center">
          <Link href="/browse">Browse</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/my-listings">My Listings</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/login">Login</Link>
        </nav>

      </div>
    </header>
  );
}
