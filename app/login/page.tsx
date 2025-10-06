"use client";

import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Welcome Back
          </h1>

          {/* Login form */}
          <LoginForm />

          {/* Switch to register */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?
            <Link
              href="/register"
              className="ml-2 text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>
    </div>
  );
}