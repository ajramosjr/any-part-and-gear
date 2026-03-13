"use client";

import { Suspense } from "react";
import SubmitReviewClient from "./SubmitReviewClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitReviewClient />
    </Suspense>
  );
}
