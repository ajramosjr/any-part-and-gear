import { createClient } from "@/lib/supabaseServer";

export async function getSellerLevel(sellerId: string) {
  const supabase = createClient();

  // Count completed sales
  const { count: completedSales, error: salesError } = await supabase
    .from("trades")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "completed");

  if (salesError) {
    console.error("Error fetching completed sales:", salesError);
  }

  // Get seller reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("seller_reviews")
    .select("rating")
    .eq("seller_id", sellerId);

  if (reviewsError) {
    console.error("Error fetching seller reviews:", reviewsError);
  }

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const sales = completedSales ?? 0;

  // Seller tier logic
  if (sales >= 50 && averageRating >= 4.8) return "Elite Seller";
  if (sales >= 10 && averageRating >= 4.5) return "Trusted Seller";
  if (sales >= 3) return "Active Seller";

  return "New Seller";
}
