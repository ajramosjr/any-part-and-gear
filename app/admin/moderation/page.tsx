import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import VerifiedBadge from "@/components/VerifiedBadge";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data: reviews } = await supabase
    .from("seller_reviews")
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      seller_id,
      reviewer_id
    `
    )
    .order("created_at", { ascending: false });

  const { data: sellers } = await supabase
    .from("profiles")
    .select("id, username, trust_score, total_sales");

  return { reviews, sellers };
}

export default async function AdminModerationPage() {
  const { reviews, sellers } = await getAdminData();

  return (
    <main style={{ padding: 40, maxWidth: 1100 }}>
      <h1>🛡️ Admin Moderation Dashboard</h1>
      <p style={{ color: "#555" }}>
        Review activity, detect abuse, and manage trust
      </p>

      {/* REVIEWS */}
      <section style={{ marginTop: 40 }}>
        <h2>🚩 Seller Reviews</h2>

        {reviews?.length === 0 && <p>No reviews found.</p>}

        {reviews?.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <strong>⭐ {r.rating}/5</strong>
            <p>{r.comment}</p>
            <p style={{ fontSize: 12, color: "#666" }}>
              Seller: {r.seller_id} | Reviewer: {r.reviewer_id}
            </p>

            <form
              action={`/api/admin/delete-review`}
              method="POST"
            >
              <input type="hidden" name="reviewId" value={r.id} />
              <button
                style={{
                  marginTop: 8,
                  background: "#dc2626",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete Review
              </button>
            </form>
          </div>
        ))}
      </section>

      {/* SELLERS */}
      <section style={{ marginTop: 60 }}>
        <h2>👤 Sellers</h2>

        <table
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th>Seller</th>
              <th>Trust</th>
              <th>Sales</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sellers?.map((s) => (
              <tr key={s.id}>
                <td>{s.username || "Seller"}</td>
                <td>{s.trust_score ?? 0}</td>
                <td>{s.total_sales ?? 0}</td>
                <td>
                  {s.trust_score >= 80 &&
                  s.total_sales >= 5 ? (
                    <VerifiedBadge />
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
