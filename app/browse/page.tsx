import { createClient } from "@/lib/supabase";

export default async function BrowsePage() {
  const supabase = await createClient();

  const { data: parts, error } = await supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: images } = await supabase
  .from("part_images")
  .select("*");
  <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
  {images
    ?.filter((img) => img.part_title === part.title)
    .map((img) => (
      <img
        key={img.id}
        src={img.image_url}
        alt={part.title}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    ))}
</div>
  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading parts
      </div>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Browse Parts
      </h1>

      {parts && parts.length === 0 && (
        <p className="text-zinc-400">No parts listed yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts?.map((part) => (
          <div
            key={part.id}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between"
          >
            {/* Part Info */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {part.title}
              </h3>

              <p className="text-sm text-zinc-400 mt-1">
                {part.description}
              </p>

              <p className="text-sm text-zinc-500 mt-1">
                Fits: {part.vehicle_year} {part.vehicle_make} {part.vehicle_model}
              </p>

              <p className="text-green-400 font-bold mt-2">
                ${part.price}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <a
                href={`/seller/${part.seller_id}`}
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded"
              >
                Message Seller
              </a>

              <form
                action={async () => {
                  "use server";
                  const supabase = await createClient();
                  await supabase.from("parts").delete().eq("id", part.id);
                }}
              >
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
