import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // optional redirect path
  const next = searchParams.get("next") ?? "/";

  return NextResponse.redirect(`${origin}${next}`);
}
