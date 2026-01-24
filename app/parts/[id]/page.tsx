import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return <div>Part not found</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
