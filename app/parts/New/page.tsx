"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPartPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    platform: "",
    category: "",
    title: "",
    description: "",
    price: "",
    trade_available: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("parts").insert([
      {
        platform: form.platform,
        category: form.category,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        trade_available: form.trade_available,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/parts");
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a Part</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* PLATFORM */}
        <select
          name="platform"
          required
          value={form.platform}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Platform</option>
          <option value="Automotive">Automotive</option>
          <option value="Marine">Marine</option>
          <option value="RC">RC</option>
          <option value="Universal">Universal</option>
        </select>

        {/* CATEGORY */}
        <select
          name="category"
          required
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Brakes">Brakes</option>
          <option value="Engine">Engine</option>
          <option value="Suspension">Suspension</option>
          <option value="Electrical">Electrical</option>
          <option value="Body">Body</option>
          <option value="Interior">Interior</option>
          <option value="Drivetrain">Drivetrain</option>
          <option value="Other">Other</option>
        </select>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Part title"
          required
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* PRICE */}
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* TRADE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="trade_available"
            checked={form.trade_available}
            onChange={handleChange}
          />
          Open to trade
        </label>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Posting..." : "Post Part"}
        </button>
      </form>
    </main>
  );
}
