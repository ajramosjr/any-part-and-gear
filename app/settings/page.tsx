"use client";

import { useEffect, useState, useRef } from "react";
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const previewUrlRef = useRef<string | null>(null);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

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

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Please upload a valid image (JPEG, PNG, GIF, or WebP)." });
      e.target.value = "";
      return;
    }

    // Revoke previous preview URL before creating a new one
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage(null);

    let finalAvatarUrl = avatarUrl;

    // Upload new avatar file if selected
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        setMessage({ type: "error", text: `Avatar upload failed: ${uploadError.message}` });
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      finalAvatarUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName || null,
      username: username || null,
      avatar_url: finalAvatarUrl || null,
      website: website || null,
    });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading…</div>;
  }

  const displayPreview = avatarPreview || avatarUrl || null;
  const initials = (fullName || username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="avatar-upload" className="cursor-pointer group">
            {displayPreview ? (
              <Image
                src={displayPreview}
                alt="Avatar preview"
                width={96}
                height={96}
                className="rounded-full object-cover border-2 border-blue-300 w-24 h-24 group-hover:opacity-80 transition-opacity"
              />
            ) : (
              <span className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold flex items-center justify-center border-2 border-dashed border-blue-300 group-hover:border-blue-500 transition-colors">
                {initials}
              </span>
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-gray-400">
            Click your photo to change it
          </p>
        </div>

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
