"use client";

import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* ---------- Main content ---------- */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
            Create&nbsp;an&nbsp;Account
          </h1>

          {/* Registration form */}
          <RegisterForm />

          {/* Switch to login */}
          <div className="mt-6 text-center text-sm sm:text-base text-gray-600">
            Already have an account?
            <Link
              href="/login"
              className="ml-2 text-blue-600 font-medium hover:underline"
            >
              Log&nbsp;in
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