"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

type Part = {
  id: number;
  title: string;
  price: number;
  platform: string;
  category: string;
  trade_available: boolean;
  image_urls: string[] | null;
};

const categories = [
  "All",
  "Brakes",
  "Engine",
  "Suspension",
  "Electrical",
  "Body",
  "Interior",
  "Drivetrain",
  "Other",
];

export default function PartsPage() {
  const supabase = createClient();

  const [parts, setParts] = useState<Part[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [tradeOnly, setTradeOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data } = await supabase
          .from("favorites")
          .select("part_id")
          .eq("user_id", user.id);

        setFavorites(data?.map((f) => f.part_id) || []);
      }

      fetchParts();
    };

    init();
  }, [activeCategory, tradeOnly]);

  const fetchParts = async () => {
    setLoading(true);

    let query = supabase
      .from("parts")
      .select("*")
      .order("created_at", { ascending: false });

    if (activeCategory !== "All") {
      query = query.eq("category", activeCategory);
    }

    if (tradeOnly) {
      query = query.eq("trade_available", true);
    }

    const { data } = await query;
    setParts(data || []);
    setLoading(false);
  };

  const toggleFavorite = async (partId: number) => {
    if (!userId) {
      alert("Please sign in to save listings.");
      return;
    }

    const isSaved = favorites.includes(partId);

    if (isSaved) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("part_id", partId);

      setFavorites((prev) => prev.filter((id) => id !== partId));
    } else {
      await supabase.from("favorites").insert({
        user_id: userId,
        part_id: partId,
      });

      setFavorites((prev) => [...prev, partId]);
    }
  };
