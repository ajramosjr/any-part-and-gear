"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createPart } from "../actions/createPart";

export default function SellClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success("✅ Part listed successfully!");
      router.replace("/sell");
    }

    if (error) {
      toast.error(decodeURIComponent(error));
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
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Part title" required />
      <button type="submit">Submit</button>
    </form>
  );
}
