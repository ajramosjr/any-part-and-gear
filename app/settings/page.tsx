"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/getProfile";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [website, setWebsite] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url, website")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setUsername(data.username ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setWebsite(data.website ?? "");
      }

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName || null,
      username: username || null,
      avatar_url: avatarUrl || null,
      website: website || null,
    });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading…</div>;
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="Avatar preview"
              width={64}
              height={64}
              className="mt-2 rounded-full object-cover border"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-medium"
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </main>
  );
}
