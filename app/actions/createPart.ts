export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  if (!title || !price) {
    redirect("/sell?error=Missing required fields");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("parts").insert({
    title,
    description,
    price,
  });

  if (error) {
    redirect(`/sell?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/browse");
}
