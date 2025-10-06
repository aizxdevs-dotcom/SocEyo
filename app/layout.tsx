import "./globals.css";
import type { ReactNode } from "react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

export const metadata = {
  title: "Soceyo",
  description: "Social platform built with Next.js + FastAPI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}