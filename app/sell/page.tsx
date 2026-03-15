"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";

export default function SellPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
const [price, setPrice] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("");
const [subcategory, setSubcategory] = useState("");
const [vehicle, setVehicle] = useState("");
const [partType, setPartType] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
const [condition, setCondition] = useState("");
const [loading, setLoading] = useState(false);
  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("parts").insert({
  title,
  price: Number(price),
  description,
  category,
  vehicle_type: vehicle,
  image_url: imageUrl,
  user_id: user.id,
});
    
    setLoading(false);

    if (!error) {
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setVehicle("");
      setPartType("");
      setImageUrl("");

      router.push("/my-listings");
    }
  };

  return (
    <RequireAuth>
      <main className="max-w-2xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          Sell a Part
        </h1>

        <form onSubmit={submitListing} className="space-y-4">

          <input
            className="border w-full p-3 rounded"
            placeholder="Listing Title (ex: Ford F150 Headlights)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="border w-full p-3 rounded"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select
            className="border w-full p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="cars">Cars</option>
            <option value="boats">Boats</option>
            <option value="marine">Marine</option>
            <option value="tools">Tools</option>
            <option value="machinery">Machinery</option>
            <option value="rc">RC Vehicles</option>
            <option value="rv">RV Vehicles</option>
            <option value="buses">Buses</option>
          </select>
          <select
  className="border w-full p-3 rounded"
  value={subcategory}
  onChange={(e) => setSubcategory(e.target.value)}
>
  <option value="">Select Sub Category</option>

  {category === "cars" && (
    <>
      <option value="engine">Engine</option>
      <option value="transmission">Transmission</option>
      <option value="exhaust">Exhaust</option>
      <option value="headlights">Headlights</option>
      <option value="interior">Interior</option>
    </>
  )}

  {category === "boats" && (
    <>
      <option value="propeller">Propeller</option>
      <option value="jet pump">Jet Pump</option>
      <option value="marine engine">Marine Engine</option>
    </>
  )}

  {category === "rc" && (
    <>
      <option value="motor">Motor</option>
      <option value="esc">ESC</option>
      <option value="battery">Battery</option>
      <option value="tires">Tires</option>
    </>
  )}
</select>
          <select
  className="border w-full p-3 rounded"
  onChange={(e) => setCondition(e.target.value)}
>
  <option value="">Condition</option>
  <option value="new">New</option>
  <option value="used">Used</option>
  <option value="refurbished">Refurbished</option>
</select>

          <input
            className="border w-full p-3 rounded"
            placeholder="Vehicle Compatibility (ex: 2018 Ford F150)"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />

          <input
            className="border w-full p-3 rounded"
            placeholder="Part Type (ex: Headlights, Engine, Propeller)"
            value={partType}
            onChange={(e) => setPartType(e.target.value)}
          />

          <input
            className="border w-full p-3 rounded"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
 <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  }}
/>
          <textarea
            className="border w-full p-3 rounded"
            placeholder="Describe the part"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Listing"}
          </button>

        </form>

      </main>
    </RequireAuth>
  );
}
