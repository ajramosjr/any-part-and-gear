"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/");
      router.refresh(); // 🔄 ensure navbar updates
    }
  };

  const signUp = async () => {
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Account created! Check your email to confirm before signing in."
      );
    }
  };

  return (
    <main style={{ padding: 40, maxWidth: 400 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />
      <br /><br />

      <button onClick={signIn} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button
        onClick={signUp}
        disabled={loading}
        style={{ marginLeft: 8 }}
      >
        Sign Up
      </button>

      {message && (
        <p style={{ marginTop: 16, color: "#374151" }}>{message}</p>
      )}
    </main>
  );
}
