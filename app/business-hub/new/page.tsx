"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const SPECIALTIES = [
  "Engine & Drivetrain",
  "Body & Paint",
  "Electrical",
  "Suspension & Brakes",
  "Tires & Wheels",
  "Transmission",
  "Marine / Boats",
  "RC Vehicles",
  "General Auto",
  "Tools & Equipment",
];

export default function NewBusinessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setSubmitting(true);

    const { data, error: insertError } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        phone: phone.trim() || null,
        website: website.trim() || null,
        photo_url: photoUrl.trim() || null,
        specialties: selectedSpecialties,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/business-hub/${data.id}`);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-1">List Your Business</h1>
      <p className="text-gray-500 mb-8">
        Get discovered by local customers looking for mechanics and parts specialists.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Business name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
            placeholder="e.g. Mike's Auto Repair"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
            placeholder="Tell customers about your shop, experience, and services…"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="123 Main St"
          />
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Houston"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="TX"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="(555) 000-0000"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold mb-1">Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="https://yourshop.com"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-sm font-semibold mb-1">Shop Photo URL</label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="https://…"
          />
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded-lg"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Specialties{" "}
            <span className="font-normal text-gray-400">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => {
              const active = selectedSpecialties.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 disabled:opacity-50 transition"
        >
          {submitting ? "Saving…" : "List My Business"}
        </button>
      </form>
    </main>
  );
}
