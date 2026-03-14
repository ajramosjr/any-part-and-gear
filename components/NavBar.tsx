"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Any Part & Gear"
            width={180}
            height={70}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/browse">Browse</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/my-listings">My Listings</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/login">Login</Link>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4">
          <Link href="/browse">Browse</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/my-listings">My Listings</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/login">Login</Link>
        </div>
      )}
    </header>
  );
}
