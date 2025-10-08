// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

export const metadata = {
  title: "Soceyo",
  description: "Social platform built with Next.js + FastAPI",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}