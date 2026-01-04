import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>Part not found</h1>
      <p>The part you’re looking for doesn’t exist or was removed.</p>
      <Link href="/browse">← Back to Browse</Link>
    </main>
  );
}
