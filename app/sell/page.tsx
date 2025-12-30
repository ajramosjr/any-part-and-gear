"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createPart } from "../actions/createPart";

export default function SellPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      toast.success("✅ Part listed successfully!");

      // Remove the query param so toast doesn't repeat
      router.replace("/sell");
    }
  }, [searchParams, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    toast.loading("Submitting...", { id: "submit" });

    await createPart(formData);

    toast.dismiss("submit");
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell or Trade Parts</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <input
          name="title"
          placeholder="Part name (e.g. 2018 Ford Headlight)"
          required
        />

        <button type="submit">Submit Part</button>
      </form>
    </main>
  );
}
