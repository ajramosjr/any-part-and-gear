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

  const image = formData.get("image") as File;

let image_url = null;

if (image && image.size > 0) {
  const fileName = `${Date.now()}-${image.name}`;

  const { data, error } = await supabase.storage
    .from("part-images")
    .upload(fileName, image);

  if (error) {
    redirect("/sell?error=Image upload failed");
  }

  image_url = supabase.storage
    .from("part-images")
    .getPublicUrl(fileName).data.publicUrl;
}
  
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
