"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function BrowseContent() {

const searchParams = useSearchParams();
const search = searchParams.get("search");

const [parts, setParts] = useState<any[]>([]);

useEffect(() => {

const loadParts = async () => {

let query = supabase
.from("parts")
.select("*")
.order("created_at", { ascending: false });

if (search) {
query = query.ilike("title", `%${search}%`);
}

const { data } = await query;

if (data) setParts(data);

};

loadParts();

}, [search]);

return (

<main className="max-w-6xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Browse Marketplace
</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{parts.map((part) => (

<Link
key={part.id}
href={`/parts/${part.id}`}
className="border rounded-xl p-4 hover:shadow-lg transition bg-white"
>

{part.image_url && (
<img
src={part.image_url}
className="w-full h-40 object-cover rounded mb-3"
/>
)}

<h3 className="font-semibold text-lg">
{part.title}
</h3>

{part.price && (
<p className="text-green-600 font-bold">
${part.price}
</p>
)}

</Link>

))}

</div>

</main>

);

}

export default function BrowsePage() {
  return (
    <Suspense fallback={<p className="p-6">Loading marketplace…</p>}>
      <BrowseContent />
    </Suspense>
  );
}
