import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function PartPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();

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

  const { data } = await supabase
    .from("parts")
    .select("*")
    .eq("id", params.id)
    .single();

  return (
    <div>
      <h1>{data?.title ?? "Part"}</h1>
    </div>
  );
}
