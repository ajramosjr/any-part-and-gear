import SellForm from "@/components/SellForm";
import { supabase } from "@/lib/supabaseBrowser";

export default async function SellPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Please log in to sell items</h1>
      </main>
    );
  }

  return <SellForm />;
}
