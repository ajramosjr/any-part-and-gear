type VerifiedBadgeProps = {
  verified?: boolean;
};

export default function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      style={{
        marginLeft: 8,
        padding: "2px 8px",
        borderRadius: 999,
        background: "#16a34a",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      ✔ Verified
    </span>
  );
}
