"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle login success from form (assuming LoginForm supports onSuccess)
  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const router = useRouter();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  const handleEmailNotVerified = (email: string) => {
    setPendingEmail(email);
    setCountdown(3);
    setShowVerifyDialog(true);
  };

  useEffect(() => {
    if (!showVerifyDialog) return;
    if (countdown <= 0) {
      // Redirect to verification page
      const q = pendingEmail ? `?email=${encodeURIComponent(pendingEmail)}` : "";
      router.push(`/verify-email${q}`);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showVerifyDialog, countdown, pendingEmail, router]);

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
          <LoginForm onSuccess={handleLoginSuccess} onEmailNotVerified={handleEmailNotVerified} />

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

      {/* Verification dialog shown when login reports unverified email (simple white card, not glass) */}
      {showVerifyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowVerifyDialog(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 sm:p-8 z-10"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Email not verified</h3>
            <p className="text-sm text-gray-700 mb-4">
              Your email <strong className="font-medium">{pendingEmail}</strong> is not verified yet. We will
              redirect you to the verification page in <span className="font-semibold">{countdown}</span>{' '}
              second{countdown !== 1 ? 's' : ''}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <Button variant="secondary" onClick={() => setShowVerifyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => router.push(`/verify-email?email=${encodeURIComponent(pendingEmail || '')}`)}>
                Go to verification now
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}