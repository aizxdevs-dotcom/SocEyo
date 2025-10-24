"use client";

import React from "react";
import ClientMessages from "./ClientMessages";

export default function Page() {
  // This page is a client component and simply mounts the heavy client-only chat UI.
  // Keeping it client avoids server prerender / useSearchParams errors.
  return <ClientMessages />;
}