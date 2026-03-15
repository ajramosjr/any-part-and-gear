"use client";

import { useState } from "react";

export default function PostListing() {

  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [part, setPart] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Post a Part
      </h1>

      <div className="grid gap-4">

        <input
          placeholder="Listing Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          placeholder="Vehicle"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          placeholder="Part"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 rounded"
        />

        <button className="bg-green-600 text-white py-3 rounded-lg">
          Publish Listing
        </button>

      </div>

    </main>
  );
}
