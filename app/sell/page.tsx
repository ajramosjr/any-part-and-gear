export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SellClient from "./SellClient";

export default function SellPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Sell a Part</h1>

      <Suspense fallback={null}>
        <SellClient />
      </Suspense>
    </main>
  );
}
