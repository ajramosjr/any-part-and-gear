import { createClient } from "@/lib/supabase";

export default async function ListingsPage() {
  const supabase = createClient();

  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return <p>Error loading listings</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Latest Parts</h1>

      <div className="grid gap-4">
        {parts?.map((part) => (
          <div
            key={part.id}
            className="border rounded p-4 bg-white shadow"
          >
            <p><strong>Vehicle Type:</strong> {part.vehicle_type}</p>
            <p><strong>Part:</strong> {part.part_name}</p>
            <p><strong>Condition:</strong> {part.condition}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
