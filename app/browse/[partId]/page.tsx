import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", Number(params.partId))
    .single();

  if (!part) notFound();

  async function startConversation() {
    "use server";

    if (!user) redirect("/login");

    const supabase = createSupabaseServerClient();

    // Check for existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("part_id", part.id)
      .eq("buyer_id", user.id)
      .single();

    if (existing) {
      redirect(`/messages/${existing.id}`);
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        part_id: part.id,
        buyer_id: user.id,
        seller_id: part.user_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create conversation");
    }

    redirect(`/messages/${conversation.id}`);
  }

  return (
    <main style={{ padding: 40 }}>
      <Link href="/browse">← Back to Browse</Link>

      <h1>{part.title}</h1>

      {part.image_url && (
        <img
          src={part.image_url}
          alt={part.title}
          style={{ maxWidth: 400, marginBottom: 20 }}
        />
      )}

      <p>{part.description}</p>

      {part.price && <strong>${part.price}</strong>}

      {user?.id !== part.user_id && (
        <form action={startConversation}>
          <button
            style={{
              marginTop: 24,
              padding: "10px 16px",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Message Seller
          </button>
        </form>
      )}
    </main>
  );
}
