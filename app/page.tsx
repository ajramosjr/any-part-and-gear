import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .limit(6);

  return (
    <>
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: 8 }}>
        Any-Part and Gear
      </h1>

      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Buy, sell, and trade auto parts
      </p>

      <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: 16 }}>
        Latest Parts
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {parts?.map((part) => (
          <div
            key={part.id}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <h3 style={{ fontWeight: 600 }}>{part.title}</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              {part.description}
            </p>

            <p style={{ fontWeight: 700, marginTop: 8 }}>
              ${part.price || "—"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
