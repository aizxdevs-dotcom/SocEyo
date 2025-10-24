"use client";

import React, { Suspense } from "react";
import ClientForgotPassword from "./ClientForgotPassword";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientForgotPassword />
    </Suspense>
  );
}
