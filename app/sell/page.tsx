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
  const [condition, setCondition] = useState("");

  const [location, setLocation] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const submitListing = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    let imageUrl = "";

    // Upload image
    if (imageFile) {

      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("part-images")
        .upload(fileName, imageFile);

      if (!uploadError) {

        const { data } = supabase.storage
          .from("part-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }
    }

    // Insert listing
    const { error } = await supabase.from("parts").insert({

      title,
      price: Number(price),
      description,

      category,
      subcategory,

      vehicle,
      part_type: partType,

      condition,

      location,

      image_url: imageUrl,

      user_id: user.id,

    });

    setLoading(false);

    if (!error) {

      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setVehicle("");
      setPartType("");
      setCondition("");
      setLocation("");
      setImageFile(null);

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
            placeholder="Listing Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="border w-full p-3 rounded"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* Category */}

          <select
            className="border w-full p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >

            <option value="">Category</option>

            <option value="cars">Cars</option>
            <option value="boats">Boats</option>
            <option value="marine">Marine</option>
            <option value="tools">Tools</option>
            <option value="machinery">Machinery</option>
            <option value="rc">RC Vehicles</option>
            <option value="rv">RV Vehicles</option>
            <option value="buses">Buses</option>

          </select>

          {/* Subcategory */}

          <select
            className="border w-full p-3 rounded"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >

            <option value="">Subcategory</option>

            <option value="engine">Engine</option>
            <option value="transmission">Transmission</option>
            <option value="interior">Interior</option>
            <option value="exterior">Exterior</option>
            <option value="wheels">Wheels</option>
            <option value="electronics">Electronics</option>
            <option value="propeller">Propeller</option>
            <option value="motor">Motor</option>
            <option value="battery">Battery</option>

          </select>

          {/* Vehicle */}

          <input
            className="border w-full p-3 rounded"
            placeholder="Vehicle Compatibility (ex: 2018 Ford F150)"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />

          {/* Part Type */}

          <input
            className="border w-full p-3 rounded"
            placeholder="Part Type (ex: Headlights, Engine)"
            value={partType}
            onChange={(e) => setPartType(e.target.value)}
          />

          {/* Condition */}

          <select
            className="border w-full p-3 rounded"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >

            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
            <option value="for-parts">For Parts</option>

          </select>

          {/* Location */}

          <input
            className="border w-full p-3 rounded"
            placeholder="Location (City or Zip)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Image Upload */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImageFile(e.target.files[0]);
              }
            }}
          />

          {/* Description */}

          <textarea
            className="border w-full p-3 rounded"
            placeholder="Describe the part"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Submit */}

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
