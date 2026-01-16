type Part = {
  id?: string;
  title: string;
  price: number;
  fitment?: string;
  image?: string;
};

export default function PartCard({ part }: { part: Part }) {
  return (
    <div className="bg-[#0f172a] text-white rounded-xl shadow-lg overflow-hidden border border-slate-800">
      <div className="h-40 bg-slate-900 flex items-center justify-center">
        {part.image ? (
          <img
            src={part.image}
            alt={part.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-slate-400 text-sm">No Image</span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{part.title}</h3>

        {part.fitment && (
          <p className="text-sm text-slate-400">{part.fitment}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-yellow-400">
            ${part.price}
          </span>

          <button className="px-3 py-1 rounded-md bg-yellow-500 text-black text-sm font-medium hover:bg-yellow-400">
            View Part
          </button>
        </div>
      </div>
    </div>
  );
}
