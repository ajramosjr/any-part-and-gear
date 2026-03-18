"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const INPUT_CLS =
  "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

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

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !ALLOWED_TYPES[file.type]) {
      setError("Please upload a valid image (JPEG, PNG, GIF, or WebP).");
      e.target.value = "";
      return;
    }
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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || null, username: username || null } },
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message ?? "Sign-up failed. Please try again.");
      setLoading(false);
      return;
    }

    const userId = signUpData.user.id;
    let avatarUrl: string | null = null;

    if (avatarFile) {
      const ext = ALLOWED_TYPES[avatarFile.type] ?? "jpg";
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }

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
    ? fullName.split(" ").filter((w) => w.length > 0).map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/60 border border-gray-100 overflow-hidden">
          {/* Header stripe */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 pt-10 pb-14 text-center">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-blue-100 text-sm mt-1">
              Set up your profile so buyers and sellers can trust you
            </p>
          </div>

          {/* Avatar — overlapping the header */}
          <div className="flex justify-center -mt-10 mb-2">
            <label htmlFor="avatar-upload" className="cursor-pointer group relative">
              <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-blue-600 flex items-center justify-center">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{initials}</span>
                )}
              </div>
              {/* Camera badge */}
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
          <p className="text-center text-xs text-gray-400 mb-6">Tap to add a profile photo</p>

          {/* Form */}
          <form onSubmit={handleSignup} className="px-8 pb-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  className={INPUT_CLS}
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <input
                  className={INPUT_CLS}
                  type="text"
                  placeholder="janedoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                className={INPUT_CLS}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                className={INPUT_CLS}
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-sm shadow-blue-200"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500 pt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
