"use client";

import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* ---------- Main content ---------- */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
            Welcome&nbsp;Back
          </h1>

          {/* Login Form */}
          <LoginForm />

          {/* Link to register */}
          <div className="mt-6 text-center text-sm sm:text-base text-gray-600">
            Don’t have an account?
            <Link
              href="/register"
              className="ml-2 text-blue-600 font-medium hover:underline"
            >
              Sign&nbsp;up
            </Link>
          </div>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="py-4 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}