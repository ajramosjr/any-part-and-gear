"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function PartPage() {

const { id } = useParams();
const [part, setPart] = useState<any>(null);

useEffect(() => {

const loadPart = async () => {

const { data } = await supabase
.from("parts")
.select("*")
.eq("id", id)
.single();

setPart(data);

};

loadPart();

}, [id]);

if (!part) return <div className="p-6">Loading...</div>;

return (

<main className="max-w-4xl mx-auto p-6">

{part.image_url && (
<img
src={part.image_url}
className="w-full h-96 object-cover rounded mb-6"
/>
)}

<h1 className="text-3xl font-bold mb-2">
{part.title}
</h1>

<p className="text-green-600 text-xl font-semibold mb-4">
${part.price}
</p>

<p className="text-gray-700 mb-6">
{part.description}
</p>

</main>

);

}
