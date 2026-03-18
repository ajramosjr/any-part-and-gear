import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Params = { params: Promise<{ id: string }> };

// GET /api/users/[id] — get public user profile + listings
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [profileRes, partsRes, reviewsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, bio, location, verified, seller_level, avatar_url, created_at")
      .eq("id", id)
      .single(),
    supabase
      .from("parts")
      .select("id, title, price, condition, image_url, category, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("rating, comment, created_at")
      .eq("seller_id", id),
  ]);

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const reviews = reviewsRes.data ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({
    profile: profileRes.data,
    listings: partsRes.data ?? [],
    reviews,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    totalListings: partsRes.data?.length ?? 0,
  });
}
