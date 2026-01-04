import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export default function Breadcrumbs({
  category,
  title,
}: {
  category?: string;
  title: string;
}) {
  return (
    <nav style={{ marginBottom: 20, fontSize: 14 }}>
      <Link href="/browse">Browse</Link>

      {category && (
        <>
          {" "}→{" "}
          <Link href={`/browse?category=${encodeURIComponent(category)}`}>
            {category}
          </Link>
        </>
      )}

      {" "}→{" "}
      <span style={{ color: "#aaa" }}>{title}</span>
    </nav>
  );
}
