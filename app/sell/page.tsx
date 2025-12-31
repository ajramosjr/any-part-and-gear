import SellClient from "./SellClient";

export default function SellPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Sell a Part</h1>

      {/* DEBUG — THIS MUST SHOW */}
      <p style={{ color: "lime", fontWeight: "bold" }}>
        SELL PAGE IS RENDERING
      </p>

      <SellClient />
    </main>
  );
}
