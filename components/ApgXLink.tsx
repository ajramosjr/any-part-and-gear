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
    <section className="mt-14">

      <h2 className="text-2xl font-bold mb-4">
        🔗 A.P.G X-Link — Compare Prices
      </h2>

      <p className="text-gray-500 mb-6">
        Find this part from trusted retailers and compare prices instantly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <a
          href={amazonLink}
          target="_blank"
          className="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <img
            src="/amazon.png"
            className="rounded mb-3"
          />

          <h3 className="font-semibold mb-1">
            Find "{part}" on Amazon
          </h3>

          <p className="text-gray-500">
            View listings, reviews, and fast shipping.
          </p>
        </a>

        <a
          href={ebayLink}
          target="_blank"
          className="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <img
            src="/ebay.png"
            className="rounded mb-3"
          />

          <h3 className="font-semibold mb-1">
            Find "{part}" on eBay
          </h3>

          <p className="text-gray-500">
            Compare new and used parts from sellers.
          </p>
        </a>

        <a
          href={amazonLink}
          target="_blank"
          className="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <img
            src="/compare.png"
            className="rounded mb-3"
          />

          <h3 className="font-semibold mb-1">
            Compare Prices
          </h3>

          <p className="text-gray-500">
            See multiple sellers and choose the best deal.
          </p>
        </a>

      </div>

    </section>
  );
}
