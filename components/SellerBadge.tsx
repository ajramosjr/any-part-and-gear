"use client";

type Props = {
  tier: "Bronze" | "Silver" | "Gold";
};

export default function SellerBadge({ tier }: Props) {
  const color =
    tier === "Gold"
      ? "#f59e0b"
      : tier === "Silver"
      ? "#64748b"
      : "#92400e";

  return (
    <span
      style={{
        background: color,
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        marginLeft: 8,
      }}
    >
      {tier}
    </span>
  );
}
