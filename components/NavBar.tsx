import Image from "next/image";
import Link from "next/link";

<Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="Any Part & Gear"
    width={200}
    height={90}
    className="h-12 w-auto"
    priority
  />
</Link>
        {/* Navigation */}
        <nav className="flex gap-6 text-gray-700 font-medium items-center">

          <Link href="/browse">Browse</Link>

          <Link href="/sell">Sell</Link>

          <Link href="/my-listings">My Listings</Link>

          {/* Messages */}
          <Link href="/messages">Messages</Link>

          <Link href="/login">Login</Link>

        </nav>

      </div>

    </header>
  );
}
