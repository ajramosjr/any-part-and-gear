import { createClient } from "@/lib/supabaseClient";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { to?: string; part?: string };
}) {
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Messages about: {searchParams.part}</h2>

      <div style={{ marginTop: "20px" }}>
        {messages?.map((msg) => (
          <div
            key={msg.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
            }}
          >
            <strong>{msg.sender_id}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <form action="/messages/send" method="POST" style={{ marginTop: "20px" }}>
        <input type="hidden" name="receiver_email" value={searchParams.to} />
        <input type="hidden" name="part_title" value={searchParams.part} />

        <textarea
          name="message"
          required
          placeholder="Type your message..."
          style={{ width: "100%", padding: "10px" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            background: "#0a2540",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
