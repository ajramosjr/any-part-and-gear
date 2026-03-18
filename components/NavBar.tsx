"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/getProfile";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch initial session
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, website, created_at, updated_at")
          .eq("id", data.user.id)
          .single();
        setProfile(profileData ?? null);
      }
    };
    loadUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url, website, created_at, updated_at")
            .eq("id", currentUser.id)
            .single();
          setProfile(profileData ?? null);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Determine display name: full_name → username → email
  const displayName =
    profile?.full_name ||
    profile?.username ||
    user?.email ||
    "Account";

  // Avatar initials fallback
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="A.P.G Logo"
            width={48}
            height={48}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="hover:text-blue-600">
            Browse
          </Link>

          <Link href="/sell" className="hover:text-blue-600">
            Sell
          </Link>

          <Link href="/businesses" className="hover:text-blue-600 font-medium">
            🔧 Businesses
          </Link>

          <Link href="/terms" className="hover:text-blue-600 text-sm text-gray-500">
            Terms
          </Link>

          {user && (
            <>
              <Link href="/messages" className="hover:text-blue-600">
                Messages
              </Link>

              <Link href="/notifications" className="hover:text-blue-600">
                Notifications
              </Link>
            </>
          )}

          {/* User profile area or Login */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/user/${user.id}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                    {initials}
                  </span>
                )}
                <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                  {displayName}
                </span>
              </Link>

              <Link href="/settings" className="text-sm hover:text-blue-600 text-gray-500">
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-200 motion-reduce:transition-none ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-6 py-4 flex flex-col gap-4">
          <Link href="/browse" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            Browse
          </Link>

          <Link href="/sell" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>
            Sell
          </Link>

          <Link href="/businesses" className="hover:text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
            🔧 Businesses
          </Link>

          <Link href="/terms" className="hover:text-blue-600 text-sm text-gray-500" onClick={() => setMenuOpen(false)}>
            Terms
          </Link>

          {user && (
            <>
              <Link href="/messages" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                Messages
              </Link>

              <Link href="/notifications" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                Notifications
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                href={`/user/${user.id}`}
                className="flex items-center gap-2 hover:opacity-80"
                onClick={() => setMenuOpen(false)}
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={displayName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center">
                    {initials}
                  </span>
                )}
                <span className="text-sm font-medium text-gray-800">
                  {displayName}
                </span>
              </Link>

              <Link href="/settings" className="text-sm hover:text-blue-600 text-gray-500" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>

              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 text-sm w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
