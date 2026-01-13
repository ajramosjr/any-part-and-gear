import { createClient } from "@/lib/supabaseServer";
import SellClient from "./SellClient";

export default async function SellPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Please log in to sell items.</p>;
  }

  return <SellClient />;
}
