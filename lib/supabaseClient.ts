import { createClient } from "@/lib/supabaseClient";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { conversation?: string };
}) {
  const supabase = createClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p>Error loading messages</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Messages</h1>

      {messages?.length === 0 && <p>No messages yet.</p>}

      {messages?.map((msg) => (
        <div
          key={msg.id}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            background: "#f3f4f6",
          }}
        >
          <p>{msg.content}</p>
          <small>
            {new Date(msg.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
