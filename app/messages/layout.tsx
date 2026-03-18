"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: 24,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Messages
        </h1>

        {children}
      </div>
    </div>
  );
}

