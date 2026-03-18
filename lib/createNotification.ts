import { supabase } from "@/lib/supabaseClient";

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    link,
  });

  if (error) {
    console.error("Notification error:", error.message);
  }
}
