"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="font-bold text-xl tracking-tight text-blue-600">Soceyo</h1>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center bg-white">
        <h2 className="max-w-2xl text-5xl font-extrabold leading-tight text-gray-900">
          Connect, Share, and Grow with{" "}
          <span className="text-blue-600">Soceyo Community</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
          A social platform built with FastAPI × Next.js for meaningful connections.
        </p>

        {/* Call‑to‑Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium shadow transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-blue-500 hover:bg-blue-50 text-blue-600 px-6 py-3 text-base font-medium transition-colors"
          >
            I Already Have an Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </main>
  );
}