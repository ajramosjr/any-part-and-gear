"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SellPartPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    /* -----------------------------------
       1️⃣ AUTH CHECK
    ----------------------------------- */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      setLoading(false);
      setError("You must be logged in to sell a part.");
      return;
    }

    /* -----------------------------------
       2️⃣ ENSURE PROFILE EXISTS (NO FK FAILS)
    ----------------------------------- */
    await supabase.from("profiles").upsert({
      id: user.id,
    });

    /* -----------------------------------
       3️⃣ OPTIONAL IMAGE UPLOAD (SAFE)
    ----------------------------------- */
    let image_url: string | null = null;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("part-images")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn("Image upload failed:", uploadError.message);
      } else {
        const { data } = supabase.storage
          .from("part-images")
          .getPublicUrl(fileName);

        image_url = data.publicUrl;
      }
    }

    /* -----------------------------------
       4️⃣ INSERT PART (FAIL-SAFE)
    ----------------------------------- */
    const { data: part, error: insertError } = await supabase
      .from("parts")
      .insert({
        title,
        vehicle,
        price: price ? Number(price) : null,
        image_url,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      setError("Failed to create listing. Please try again.");
      setLoading(false);
      return;
    }

    /* -----------------------------------
       5️⃣ REDIRECT TO PART DETAIL PAGE
    ----------------------------------- */
    router.push(`/parts/${part.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sell a Part</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Part title (ex: All-Terrain Tire)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Vehicle (ex: Ford F-350)"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Price (optional)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Part"}
        </button>
      </form>
    </div>
  );
}
