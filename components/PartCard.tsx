import Image from "next/image";
import Link from "next/link";

type Part = {
  id: string;
  title: string;
  price: number;
  fitment?: string | null;
  image_url?: string | null;
};

export default function PartCard({ part }: { part: Part }) {
  const imageSrc =
    part.image_url && part.image_url.startsWith("http")
      ? part.image_url
      : "/logo.png";

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <Link href={`/parts/${part.id}`} className="block">
        <div className="h-40 bg-gray-100 relative">
          <Image
            src={imageSrc}
            alt={part.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {part.title}
        </h3>

        {part.fitment && (
          <p className="text-sm text-gray-500">
            Fits: {part.fitment}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-blue-600">
            ${part.price}
          </span>

          <Link
            href={`/parts/${part.id}`}
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500"
          >
            View Part
          </Link>
        </div>
      </div>
    </div>
  );
}
