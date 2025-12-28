export default function SellPage() {
  return (
    <main style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Sell or Trade Parts</h1>
      <p>List your parts for sale or trade with other users.</p>

      <form style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        <input
          type="text"
          placeholder="Part name (e.g. 2018 F150 Headlight)"
          required
          style={{ padding: "12px" }}
        />

        <select required style={{ padding: "12px" }}>
          <option value="">Select vehicle type</option>
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="boat">Boat</option>
          <option value="motorcycle">Motorcycle</option>
        </select>

        <select required style={{ padding: "12px" }}>
          <option value="">Sell or Trade?</option>
          <option value="sell">Sell</option>
          <option value="trade">Trade</option>
        </select>

        <textarea
          placeholder="Describe the part, condition, compatibility, etc."
          rows={4}
          style={{ padding: "12px" }}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Listing
        </button>
      </form>
    </main>
  );
}
