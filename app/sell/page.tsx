"use client";

import { supabase } from "@/lib/supabaseClient";
import SellForm from "@/components/SellForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <SellForm />;
}
