"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getProfile, Profile } from "@/lib/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // Get auth user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || null);

        // Ensure profile exists (important 🔥)
        await supabase.from("profiles").upsert({
          id: user.id,
        });

        // Fetch profile
        const profileData = await getProfile();
        setProfile(profileData);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white shadow rounded-2xl p-6 text-center">
        
        {/* Avatar */}
        <div className="mb-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold mx-auto">
              {(profile?.full_name || userEmail || "U")[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h2 className="text-xl font-semibold">
          {profile?.full_name || profile?.username || "No Name"}
        </h2>

        {/* Email fallback */}
        <p className="text-gray-500 text-sm mt-1">
          {userEmail}
        </p>

        {/* Website */}
        {profile?.website && (
          <a
            href={profile.website}
            target="_blank"
            className="text-blue-500 text-sm block mt-2"
          >
            {profile.website}
          </a>
        )}

        {/* Edit button (optional) */}
        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
          onClick={() => alert("Add edit profile page next")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
