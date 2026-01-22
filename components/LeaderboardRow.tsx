import Link from "next/link";
import VerifiedBadge from "@/components/VerifiedBadge";

type LeaderboardRowProps = {
  rank: number;
  seller: {
    id: string;
    username: string;
    verified: boolean;
    sales: number;
    rating: number;
  };
};

export default function LeaderboardRow({
  rank,
  seller,
}: LeaderboardRowProps) {
  return (
    <tr>
      <td style={{ padding: 12, fontWeight: 600 }}>
        #{rank}
      </td>

      <td style={{ padding: 12 }}>
        <Link href={`/seller/${seller.id}`}>
          {seller.username}
        </Link>

        <VerifiedBadge verified={seller.verified} />
      </td>

      <td style={{ padding: 12 }}>
        {seller.sales}
      </td>

      <td style={{ padding: 12 }}>
        ⭐ {seller.rating.toFixed(1)}
      </td>
    </tr>
  );
}
