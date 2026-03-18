import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET /api/search?q=ford&category=cars&condition=used&min=10&max=500
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const condition = searchParams.get("condition");
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");
  const tradeOnly = searchParams.get("trade") === "true";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = (page - 1) * limit;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let query = supabase
    .from("parts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    // Escape special characters to prevent injection in ILIKE patterns
    const escaped = q.replace(/[%_\\]/g, "\\$&");
    query = query.or(
      `title.ilike.%${escaped}%,description.ilike.%${escaped}%,vehicle.ilike.%${escaped}%`
    );
  }

  if (category) query = query.eq("category", category);
  if (condition) query = query.eq("condition", condition);
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (tradeOnly) query = query.eq("trade_available", true);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data, total: count, page, limit });
}
