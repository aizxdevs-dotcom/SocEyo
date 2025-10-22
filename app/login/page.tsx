"use client";

import { useState } from "react";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle login success from form (assuming LoginForm supports onSuccess)
  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-gray-900">
      {/* ---------- Success indicator ---------- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Login successful!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Main content ---------- */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6">
            Welcome&nbsp;Back
          </h1>

          {/* Login Form, pass handler down */}
          <LoginForm onSuccess={handleLoginSuccess} />

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