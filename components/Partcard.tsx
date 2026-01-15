type Part = {
  id?: string;
  title: string;
  price: number;
  fitment?: string;
};

export default function PartCard({ part }: { part: Part }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        background: "#ffffff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
        {part.title}
      </h3>

      {part.fitment && (
        <p style={{ marginTop: "6px", color: "#6b7280" }}>
          Fits: {part.fitment}
        </p>
      )}

      <p
        style={{
          marginTop: "10px",
          fontWeight: 700,
          fontSize: "16px",
        }}
      >
        ${part.price}
      </p>

      <button
        style={{
          marginTop: "14px",
          padding: "10px",
          width: "100%",
          background: "#0a2540",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        View Details
      </button>
    </div>
  );
}
type Part = {
  title: string;
  price: number;
  fitment: string;
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

        <p className="text-sm text-slate-400">{part.fitment}</p>

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
