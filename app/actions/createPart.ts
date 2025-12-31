import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function createPart(formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) {
    redirect("/sell?error=Title%20is%20required");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("parts")
    .insert({ title });

  if (error) {
    redirect(`/sell?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sell?success=1");
}
