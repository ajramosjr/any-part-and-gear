export async function deletePart(id: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("parts").delete().eq("id", id);

  redirect("/browse");
}
