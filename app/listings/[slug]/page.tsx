import { notFound } from "next/navigation";

export default function ListingsPage({ params }: { params: { slug: string } }) {

  const title = params.slug.replace(/-/g, " ");

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold capitalize mb-6">
        {title}
      </h1>

      <img
        src="/placeholder.png"
        className="rounded-lg mb-6"
      />

      <p className="text-gray-600 mb-4">
        Example listings page for {title}.
      </p>

      <p className="text-2xl font-semibold mb-6">
        $199
      </p>

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Contact Seller
      </button>

    </main>
  );
}
