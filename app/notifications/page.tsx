import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 40, maxWidth: 800 }}>
      <h1>🔔 Notifications</h1>

      {notifications?.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications?.map((n) => (
        <a
          key={n.id}
          href={n.link || "#"}
          style={{
            display: "block",
            background: n.read ? "#f8fafc" : "#e0f2fe",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            textDecoration: "none",
            color: "#000",
          }}
        >
          <strong>{n.title}</strong>
          {n.body && <p>{n.body}</p>}
          <p style={{ fontSize: 12, color: "#555" }}>
            {new Date(n.created_at).toLocaleString()}
          </p>
        </a>
      ))}
    </main>
  );
}
