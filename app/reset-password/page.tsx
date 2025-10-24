"use client";

import React, { Suspense } from "react";
import ClientResetPassword from "./ClientResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ClientResetPassword />
    </Suspense>
  );
}
