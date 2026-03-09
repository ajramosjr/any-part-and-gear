import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface EditPartPageProps {
  params: {
    id: string;
  };
}

export default async function EditPartPage({ params }: EditPartPageProps) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: part, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !part) {
    redirect("/my-listings");
  }

  // 🔐 Ownership check
  if (part.seller_id !== user.id) {
    redirect("/my-listings");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Part</h1>

      <form action={`/api/parts/${part.id}/update`} method="POST">
        <input
          type="text"
          name="title"
          defaultValue={part.title}
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="number"
          name="price"
          defaultValue={part.price}
          className="w-full border p-2 mb-3"
          required
        />

        <textarea
          name="description"
          defaultValue={part.description}
          className="w-full border p-2 mb-3"
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
