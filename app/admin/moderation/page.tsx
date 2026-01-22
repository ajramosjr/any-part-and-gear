"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function ModerationPage() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        window.location.href = "/";
        return;
      }

      // OPTIONAL: replace with admin check later
      if (auth.user.email !== "admin@anypartinggear.com") {
        window.location.href = "/";
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, email, verified")
        .order("created_at", { ascending: false });

      setSellers(data || []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading moderation…</p>;

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>🛡️ Seller Moderation</h1>

      {sellers.map((s) => (
        <div
          key={s.id}
          style={{
            background: "#fff",
            padding: 16,
            marginTop: 12,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{s.email}</strong>
            <div style={{ marginTop: 4 }}>
              <VerifiedBadge verified={s.verified} />
            </div>
          </div>

          <button
            onClick={async () => {
              await supabase
                .from("profiles")
                .update({ verified: !s.verified })
                .eq("id", s.id);

              setSellers((prev) =>
                prev.map((p) =>
                  p.id === s.id ? { ...p, verified: !p.verified } : p
                )
              );
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: s.verified ? "#dc2626" : "#16a34a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {s.verified ? "Revoke" : "Verify"}
          </button>
        </div>
      ))}
    </main>
  );
}
