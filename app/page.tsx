"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* ---------- Header ---------- */}
      <header className="flex flex-wrap justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 gap-3">
        <h1 className="font-bold text-lg sm:text-xl tracking-tight text-blue-600">
          Soceyo
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline text-sm sm:text-base"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base font-semibold shadow transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* ---------- Hero Section ---------- */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center bg-white">
        <h2 className="max-w-3xl text-3xl sm:text-5xl font-extrabold leading-snug sm:leading-tight text-gray-900">
          Connect,&nbsp;Share,&nbsp;and&nbsp;Grow&nbsp;with{" "}
          <span className="text-blue-600">Soceyo Community</span>
        </h2>

        <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-gray-600">
          A social platform built with FastAPI × Next.js for meaningful connections.
        </p>

        {/* Call‑to‑Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm sm:text-base font-medium shadow transition-colors w-full sm:w-auto text-center"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-blue-500 hover:bg-blue-50 text-blue-600 px-6 py-3 text-sm sm:text-base font-medium transition-colors w-full sm:w-auto text-center"
          >
            I Already Have an Account
          </Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="py-4 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </main>
  );
}