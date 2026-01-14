import { supabase } from "@/lib/supabaseClient";
import SellClient from "./SellClient";

export default async function SellPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Please log in to sell items.</p>;
  }

  return <SellClient />;
}
