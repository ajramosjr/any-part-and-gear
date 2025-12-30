import { createPart } from "../actions/createPart";

export default function SellPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell or Trade Parts</h1>

      <form action={createPart} style={{ display: "flex", gap: "16px" }}>
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
