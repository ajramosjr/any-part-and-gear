import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function BrowsePage() {
  const supabase = createSupabaseServerClient();

  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load parts.
      </div>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Parts</h1>

      {parts?.length === 0 && (
        <p className="text-gray-500">No parts listed yet.</p>
      )}

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parts?.map((part) => (
          <li
            key={part.id}
            className="border rounded-lg p-4 bg-white text-black shadow"
          >
            <h2 className="font-semibold">{part.title}</h2>
            <p className="text-sm text-gray-600">{part.description}</p>
            <p className="mt-2 font-bold">${part.price}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}        
