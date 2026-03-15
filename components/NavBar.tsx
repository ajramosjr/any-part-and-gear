"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="border-b bg-white">

      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Any Part & Gear"
            width={180}
            height={70}
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">

          <Link href="/browse">Browse</Link>

          <Link href="/sell">Sell</Link>

          {user && (
            <>
              <Link href="/my-listings">My Listings</Link>
              <Link href="/messages">Messages</Link>
              <Link href={`/user/${user.id}`}>Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}

          {!user && <Link href="/login">Login</Link>}

        </nav>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>

      {open && (
        <div className="md:hidden border-t bg-white p-4 flex flex-col gap-4">

          <Link href="/browse">Browse</Link>

          <Link href="/sell">Sell</Link>

          {user && (
            <>
              <Link href="/my-listings">My Listings</Link>
              <Link href="/messages">Messages</Link>
              <Link href={`/user/${user.id}`}>Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}

          {!user && <Link href="/login">Login</Link>}

        </div>
      )}

    </header>
  );
}
