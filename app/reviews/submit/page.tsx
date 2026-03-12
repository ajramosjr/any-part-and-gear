"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequireAuth from "@/app/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SubmitReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partId = searchParams.get("partId");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      part_id: partId,
      user_id: user.id,
      rating,
      comment,
    });

    setLoading(false);

    if (!error) {
      router.push(`/parts/${partId}`);
    } else {
      alert(error.message);
    }
  };
}
