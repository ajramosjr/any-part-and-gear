"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera } from "lucide-react";
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

  const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !ALLOWED_TYPES[file.type]) {
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
      const ext = ALLOWED_TYPES[avatarFile.type] ?? "jpg";
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
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/60 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 pt-10 pb-16 text-center">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <p className="text-blue-100 text-sm mt-1">Update your public profile</p>
          </div>

          {/* Avatar — overlapping */}
          <div className="flex justify-center -mt-10 mb-1">
            <label htmlFor="avatar-upload" className="cursor-pointer group relative">
              <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-blue-600 flex items-center justify-center">
                {displayPreview ? (
                  <Image
                    src={displayPreview}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{initials}</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" strokeWidth={2.5} />
              </span>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <p className="text-center text-xs text-gray-400 mb-6">Tap to change photo</p>

          {/* Form */}
          <form onSubmit={handleSave} className="px-8 pb-8 space-y-5">
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="border-t border-gray-100" />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-sm shadow-blue-200"
            >
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
