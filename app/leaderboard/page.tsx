"use client";

import { useEffect, useState } from "react";
import { getSellerLeaderboard } from "@/lib/getSellerLeaderboard";
import LeaderboardRow from "@/components/LeaderboardRow";

export default function LeaderboardPage() {
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    getSellerLeaderboard().then(setSellers);
  }, []);

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>🏆 Top Trusted Sellers</h1>

      <p style={{ marginTop: 8, color: "#555" }}>
        Ranked by Trust Score, verification, and completed sales
      </p>

      <table
        style={{
          marginTop: 24,
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th style={{ padding: 12 }}>Rank</th>
            <th style={{ padding: 12 }}>Seller</th>
            <th style={{ padding: 12 }}>Trust</th>
            <th style={{ padding: 12 }}>Sales</th>
          </tr>
        </thead>

        <tbody>
          {sellers.map((s, i) => (
            <LeaderboardRow
              key={s.id}
              rank={i + 1}
              seller={s}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
