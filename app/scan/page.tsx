"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** This page redirects to /ai-scan which is the canonical AI scan experience. */
export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ai-scan");
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-[50vh]">
      <p className="text-gray-500">Redirecting to AI Scan…</p>
    </main>
  );
}
