"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import TradeRequestForm from "@/components/TradeRequestForm";
import ApgXLink from "@/components/ApgXLink";
import VerifiedBadge from "@/components/VerifiedBadge";

type Part = {
  id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  condition?: string | null;
  category?: string | null;
  vehicle?: string | null;
  location?: string | null;
  image_url?: string | null;
  trade_available?: boolean;
  user_id: string;
  created_at: string;
};

type Profile = {
  id: string;
  username: string;
  verified: boolean;
};

export default function PartPage() {

  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<Part | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showTrade, setShowTrade] = useState(false);

  useEffect(() => {
    const loadPart = async () => {
      const { data } = await supabase
        .from("parts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setPart(data);

        // Load seller profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, username, verified")
          .eq("id", data.user_id)
          .single();

        if (profile) setSeller(profile);
      }
    };

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };

    loadPart();
    loadUser();
  }, [id]);

  if (!part) return <div className="p-6">Loading...</div>;

  const isOwner = currentUserId === part.user_id;

  return (
    <main className="max-w-4xl mx-auto p-6">

      {part.image_url && (
        <img
          src={part.image_url}
          className="w-full h-96 object-cover rounded-xl mb-6"
          alt={part.title}
        />
      )}

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left: Part details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{part.title}</h1>

          {part.price !== null && part.price !== undefined && (
            <p className="text-2xl text-green-600 font-bold mb-4">
              ${part.price}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {part.condition && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                {part.condition}
              </span>
            )}
            {part.category && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                {part.category}
              </span>
            )}
            {part.trade_available && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                Trade Available
              </span>
            )}
          </div>

          {part.vehicle && (
            <p className="text-gray-600 mb-2">
              <strong>Fits:</strong> {part.vehicle}
            </p>
          )}

          {part.location && (
            <p className="text-gray-600 mb-4">
              <strong>📍 Location:</strong> {part.location}
            </p>
          )}

          {part.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {part.description}
            </p>
          )}
        </div>

        {/* Right: Seller info + actions */}
        <div className="w-full md:w-72 space-y-4">
          {seller && (
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-2">Seller</h3>
              <div className="flex items-center gap-2 mb-3">
                <Link
                  href={`/seller/${seller.id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {seller.username}
                </Link>
                <VerifiedBadge verified={seller.verified} />
              </div>
              <Link
                href={`/seller/${seller.id}`}
                className="block text-sm text-gray-500 hover:text-blue-600"
              >
                View profile →
              </Link>
            </div>
          )}

          {!isOwner && currentUserId && (
            <div className="space-y-3">
              <Link
                href={`/messages?sellerId=${part.user_id}&partId=${part.id}`}
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Message Seller
              </Link>

              {part.trade_available && (
                <button
                  onClick={() => setShowTrade(!showTrade)}
                  className="block w-full text-center bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                  {showTrade ? "Hide Trade Form" : "Propose a Trade"}
                </button>
              )}
            </div>
          )}

          {isOwner && (
            <div className="space-y-2">
              <Link
                href={`/parts/${part.id}/edit`}
                className="block w-full text-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Edit Listing
              </Link>
            </div>
          )}

          {!currentUserId && (
            <Link
              href="/login"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Login to Contact Seller
            </Link>
          )}
        </div>
      </div>

      {/* Trade Request Form */}
      {showTrade && !isOwner && currentUserId && (
        <div className="mt-6">
          <TradeRequestForm
            partId={part.id}
            receiverId={part.user_id}
          />
        </div>
      )}

      {/* APG X-Link affiliate section */}
      <div className="mt-10">
        <ApgXLink part={part.title} />
      </div>

    </main>
  );
}

