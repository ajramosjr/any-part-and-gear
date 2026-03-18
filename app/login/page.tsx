"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {

    const checkUser = async () => {

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/");
      }

    };

    checkUser();

  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({

      email,
      password

    });

    setLoading(false);

    if (error) {

      setError(error.message);

    } else {

      router.push("/");

    }

  };

  return (

    <main className="max-w-md mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >

        <input
          className="border w-full p-3 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border w-full p-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <button
          className="bg-blue-600 text-white w-full p-3 rounded"
          disabled={loading}
        >

          {loading ? "Logging in..." : "Login"}

        </button>

      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <a href="/auth/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>

    </main>

  );
}
