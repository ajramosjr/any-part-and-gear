import { createClient } from "@/lib/supabaseServer";
import { redirect, notFound } from "next/navigation";

export default async function EditPartPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: part } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!part) notFound();
  if (part.user_id !== user.id) redirect("/");

  async function updatePart(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;

    const supabase = createClient();

    await supabase
      .from("parts")
      .update({
        title,
        price,
        description,
      })
      .eq("id", params.id);

    redirect(`/parts/${params.id}`);
  }

  return (
    <form action={updatePart} className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Listing</h1>

      <input
        name="title"
        defaultValue={part.title}
        required
        className="w-full border p-2"
      />

      <input
        name="price"
        type="number"
        defaultValue={part.price}
        required
        className="w-full border p-2"
      />

      <textarea
        name="description"
        defaultValue={part.description}
        className="w-full border p-2"
      />

      <button className="bg-black text-white px-4 py-2">
        Save Changes
      </button>
    </form>
  );
}
