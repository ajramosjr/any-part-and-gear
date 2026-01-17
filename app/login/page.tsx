"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signIn = async () => {
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in!");
      router.refresh(); // 🔑 refresh server components
      router.push("/");
    }
  };

  const signUp = async () => {
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Account created! Check your email to confirm, then sign in."
      );
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={signIn}>Sign In</button>
      <button onClick={signUp} style={{ marginLeft: 8 }}>
        Sign Up
      </button>

      {message && <p>{message}</p>}
    </main>
  );
}
