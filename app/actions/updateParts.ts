export async function updatePart(id: string, formData: FormData) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("parts").update({
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
  }).eq("id", id);

  redirect("/browse");
}
