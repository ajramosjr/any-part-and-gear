type ApgXLinkProps = {
  part: string;
};

export default function ApgXLink({ part }: ApgXLinkProps) {

  const amazonLink =
    "https://www.amazon.com/s?k=" +
    encodeURIComponent(part) +
    "&tag=YOURAFFILIATETAG";

  const ebayLink =
    "https://www.ebay.com/sch/i.html?_nkw=" +
    encodeURIComponent(part);

  return (
    <div className="border rounded-xl p-6 mt-10">

      <h2 className="text-xl font-bold mb-4">
        Recommended Parts (A.P.G X-Link)
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <a
          href={amazonLink}
          target="_blank"
          className="border p-4 rounded hover:shadow"
        >
          Buy on Amazon
        </a>

        <a
          href={ebayLink}
          target="_blank"
          className="border p-4 rounded hover:shadow"
        >
          Buy on eBay
        </a>

        <a
          href={amazonLink}
          target="_blank"
          className="border p-4 rounded hover:shadow"
        >
          Compare Prices
        </a>

      </div>

    </div>
  );
}
