type Part = {
  id?: string;
  title: string;
  price: number;
  fitment?: string;
  image?: string;
};

export default function PartCard({ part }: { part: Part }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {part.image ? (
          <img
            src={part.image}
            alt={part.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

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

          <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500">
            View Part
          </button>
        </div>
      </div>
    </div>
  );
}
