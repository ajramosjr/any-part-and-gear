type VerifiedBadgeProps = {
  verified: boolean;
};

export default function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: "#dcfce7",
        color: "#166534",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      ✅ Verified Seller
    </span>
  );
}
