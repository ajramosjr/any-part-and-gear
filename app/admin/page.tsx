"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

type Stats = {
  totalListings: number;
  totalUsers: number;
  totalReports: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    totalUsers: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [listings, users, reports] = await Promise.all([
        supabase.from("parts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalListings: listings.count ?? 0,
        totalUsers: users.count ?? 0,
        totalReports: reports.count ?? 0,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <RequireAuth>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Platform overview and moderation tools.</p>

        {loading ? (
          <p>Loading stats…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-blue-700">
                {stats.totalListings}
              </p>
              <p className="text-gray-600 mt-2">Total Listings</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-green-700">
                {stats.totalUsers}
              </p>
              <p className="text-gray-600 mt-2">Registered Users</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-red-700">
                {stats.totalReports}
              </p>
              <p className="text-gray-600 mt-2">Open Reports</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/moderation"
            className="border rounded-xl p-4 hover:shadow transition block"
          >
            <h3 className="font-semibold text-lg mb-1">🚨 Moderation</h3>
            <p className="text-gray-500 text-sm">
              Review reported listings and user complaints.
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="border rounded-xl p-4 hover:shadow transition block"
          >
            <h3 className="font-semibold text-lg mb-1">🏆 Leaderboard</h3>
            <p className="text-gray-500 text-sm">
              View top trusted sellers by trust score.
            </p>
          </Link>

          <Link
            href="/browse"
            className="border rounded-xl p-4 hover:shadow transition block"
          >
            <h3 className="font-semibold text-lg mb-1">📦 All Listings</h3>
            <p className="text-gray-500 text-sm">
              Browse all marketplace listings.
            </p>
          </Link>

          <Link
            href="/settings"
            className="border rounded-xl p-4 hover:shadow transition block"
          >
            <h3 className="font-semibold text-lg mb-1">⚙️ Settings</h3>
            <p className="text-gray-500 text-sm">
              Manage your account and profile.
            </p>
          </Link>
        </div>
      </main>
    </RequireAuth>
  );
}
