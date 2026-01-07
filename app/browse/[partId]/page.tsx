import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function PartPage({
  params,
}: {
  params: { partId: string };
}) {
  const supabase = createServerComponentClient({ cookies });

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

    // Create new conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .insert({
        part_id: part.id,
        buyer_id: user.id,
        seller_id: part.user_id,
      })
      .select()
      .single();

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
