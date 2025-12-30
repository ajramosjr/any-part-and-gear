"use client";

import { createPart } from "../actions/createPart";
import toast from "react-hot-toast";

export default function SellPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const toastId = toast.loading("Submitting part...");

    const result = await createPart(formData);

    toast.dismiss(toastId);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("✅ Part listed successfully!");
      e.currentTarget.reset();
    }
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
