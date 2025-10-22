"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-white text-gray-900 flex flex-col overflow-hidden">
      {/* 🌊 Live Moving Blue Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-blue-300/25 rounded-full blur-3xl animate-driftSlow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-400/30 rounded-full blur-3xl animate-driftReverse" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-3xl animate-driftSlow2" />
      </div>

      {/* ---------- Header ---------- */}
      <header className="relative flex flex-wrap justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 gap-3 z-10">
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
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-3xl sm:text-5xl font-extrabold leading-snug sm:leading-tight text-gray-900"
        >
          Connect&nbsp;and&nbsp;Grow&nbsp;with{" "}
          <span className="text-blue-600">Soceyo Community</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-gray-600"
        >
          A social platform built with Next.js and Neo4j.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm sm:text-base font-medium shadow transition-colors w-full sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-blue-500 hover:bg-blue-50 text-blue-600 px-6 py-3 text-sm sm:text-base font-medium transition-colors w-full sm:w-auto"
          >
            I Already Have an Account
          </Link>
        </motion.div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative py-4 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-200 z-10">
        © {new Date().getFullYear()} Soceyo. All rights reserved.
      </footer>

      {/* ✨ existing drift keyframes left unchanged */}
      <style jsx>{`
        @keyframes driftSlow {
          0% { transform: translate(0,0) scale(1); }
          25% { transform: translate(50px, -30px) scale(1.05); }
          50% { transform: translate(80px, 20px) scale(1); }
          75% { transform: translate(30px, 50px) scale(1.08); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes driftReverse {
          0% { transform: translate(0,0) scale(1); }
          25% { transform: translate(-60px, 40px) scale(1.05); }
          50% { transform: translate(-100px, -10px) scale(1.02); }
          75% { transform: translate(-40px, 60px) scale(1.07); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes driftSlow2 {
          0% { transform: translate(0,0) scale(1); }
          25% { transform: translate(40px, -60px) scale(1.03); }
          50% { transform: translate(100px, 0) scale(1.05); }
          75% { transform: translate(60px, 80px) scale(1.07); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-driftSlow { animation: driftSlow 25s ease-in-out infinite; }
        .animate-driftReverse { animation: driftReverse 30s ease-in-out infinite; }
        .animate-driftSlow2 { animation: driftSlow2 28s ease-in-out infinite; }
      `}</style>
    </main>
  );
}