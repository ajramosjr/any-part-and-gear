export default function Home() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <img
        src="/logo.png"
        alt="Any Part & Gear"
        style={{ width: "220px", marginBottom: "20px" }}
      />

      <h1>Any-Part & Gear</h1>
      <p>Buy, sell, and trade vehicle parts securely.</p>
    </main>
  );
}
import Header from "./Components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main style={{ padding: "40px", textAlign: "center" }}>
        <h1>Any-Part & Gear</h1>
        <p>Buy, sell, and trade vehicle parts securely.</p>
      </main>
    </>
  );
}
