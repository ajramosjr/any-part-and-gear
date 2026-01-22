"use client";

export default function TrustScore({
  score,
}: {
  score: number;
}) {
  const color =
    score >= 85
      ? "#16a34a"
      : score >= 70
      ? "#2563eb"
      : "#ca8a04";

  return (
    <span
      title="Seller Trust Score"
      style={{
        marginLeft: 8,
        background: color,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      Trust {score}
    </span>
  );
}
