import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function BrowsePage() {
  const supabase = createSupabaseServerClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Listings</h1>

      {(!listings || listings.length === 0) && (
        <p>No listings yet.</p>
      )}

      <ul className="space-y-2">
        {listings?.map((item) => (
          <li
            key={item.id}
            className="border rounded p-3"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-500">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
