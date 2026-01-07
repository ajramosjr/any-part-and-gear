import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import SellForm from "@/components/SellForm";

export default async function SellPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Sell a Part</h1>
      <SellForm />
    </main>
  );
}
