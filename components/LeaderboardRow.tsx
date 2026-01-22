import Link from "next/link";
import TrustScore from "@/components/TrustScore";
import VerifiedBadge from "@/components/VerifiedBadge";

export default function LeaderboardRow({
  rank,
  seller,
}: {
  rank: number;
  seller: any;
}) {
  return (
    <tr>
      <td>#{rank}</td>

      <td>
        <Link
          href={`/seller/${seller.id}`}
          style={{ fontWeight: 600, color: "#2563eb" }}
        >
          {seller.username}
        </Link>
        {seller.verified && <VerifiedBadge />}
      </td>

      <td>
        <TrustScore score={seller.trust} />
      </td>

      <td>{seller.sales}</td>
    </tr>
  );
}
