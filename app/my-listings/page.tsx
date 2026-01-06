import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function MyListings() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Please sign in</p>;
  }

  const { data: parts } = await supabase
    .from("parts")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div>
      <h1>My Listings</h1>

      {parts?.length === 0 && <p>No listings yet</p>}

      {parts?.map((part) => (
        <div key={part.id} style={{ marginBottom: 20 }}>
          <p>{part.title}</p>

          <Link href={`/my-listings/${part.id}`}>
            Edit / Delete
          </Link>
        </div>
      ))}
    </div>
  );
}
