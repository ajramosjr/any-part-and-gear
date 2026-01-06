"use client";

import { useState } from "react";

export default function SellForm() {
  const [title, setTitle] = useState("");

  return (
    <form>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Part title"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
