"use client";

import React, { Suspense } from "react";
import ClientMessages from "./ClientMessages";

export default function Page() {
  // Wrap the client chat in Suspense to satisfy Next's requirement that
  // `useSearchParams()` (used in the client chat) is inside a Suspense boundary.
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading chat…</div>}>
      <ClientMessages />
    </Suspense>
  );
}