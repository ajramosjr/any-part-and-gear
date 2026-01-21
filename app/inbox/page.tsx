"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import RequireAuth from "@/app/components/RequireAuth";

type InboxItem = {
  part_id: string;
  part_title: string;
  last_message: string;
  last_time: string;
  unread_count: number;
};

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1️⃣ Get messages
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          part_id,
          read_at,
          parts ( title )
        `
        )
        .eq("receiver_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      // 2️⃣ Group by part
      const map = new Map<string, InboxItem>();

      data.forEach((m: any) => {
        if (!map.has(m.part_id)) {
          map.set(m.part_id, {
            part_id: m.part_id,
            part_title: m.parts?.title ?? "Unknown Part",
            last_message: m.content,
            last_time: m.created_at,
            unread_count: 0,
          });
        }

        if (!m.read_at) {
          map.get(m.part_id)!.unread_count++;
        }
      });

      setItems(Array.from(map.values()));
      setLoading(false);
    };

    loadInbox();
  }, []);

  return (
    <RequireAuth>
      <main style={{ padding: 40, maxWidth: 800 }}>
        <h1>Inbox</h1>

        {loading && <p>Loading…</p>}

        {!loading && items.length === 0 && (
          <p>No messages yet.</p>
        )}

        {items.map((item) => (
          <Link
            key={item.part_id}
            href={`/parts/${item.part_id}/messages`}
            style={{
              display: "block",
              padding: 16,
              borderRadius: 12,
              background: "#fff",
              marginBottom: 14,
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <strong>{item.part_title}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>
                {new Date(item.last_time).toLocaleString()}
              </span>
            </div>

            <div style={{ color: "#374151" }}>
              {item.last_message}
            </div>

            {item.unread_count > 0 && (
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                {item.unread_count} unread
              </div>
            )}
          </Link>
        ))}
      </main>
    </RequireAuth>
  );
}
