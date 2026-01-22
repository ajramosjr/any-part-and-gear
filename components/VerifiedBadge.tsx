"use client";

export default function VerifiedBadge() {
  return (
    <span
      title="Verified Seller"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#2563eb",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        marginLeft: 8,
      }}
    >
      ✔ Verified
    </span>
  );
}
