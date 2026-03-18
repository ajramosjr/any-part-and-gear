"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrlRef = useRef<string | null>(null);

  // Revoke the object URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, GIF, or WebP).");
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Create auth user – pass metadata so the DB trigger seeds the profile row
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
            username: username || null,
          },
        },
      });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message ?? "Sign-up failed. Please try again.");
      setLoading(false);
      return;
    }

    const userId = signUpData.user.id;
    let avatarUrl: string | null = null;

    // 2. Upload avatar if provided
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }

    // 3. Upsert profile row with all collected info
    await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName || null,
      username: username || null,
      avatar_url: avatarUrl,
    });

    setLoading(false);
    router.push("/");
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Create Account</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Set up your profile so buyers and sellers can trust you.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Avatar picker */}
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="avatar-upload" className="cursor-pointer group">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                width={96}
                height={96}
                className="rounded-full object-cover border-2 border-blue-500 w-24 h-24"
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
            Click above to upload a profile photo (optional)
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="janedoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-medium"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
