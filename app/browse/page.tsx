import Link from "next/link";

<Link href={`/browse/${part.id}`} key={part.id}>
  <div className="cursor-pointer border rounded p-4 hover:bg-neutral-800">
    <h3>{part.title}</h3>

    {part.price !== null && (
      <p style={{ color: "#4ade80", marginTop: "4px" }}>
        ${part.price}
      </p>
    )}
  </div>
</Link>
