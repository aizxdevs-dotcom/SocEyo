"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, MessageCircle, User, Home } from "lucide-react";
import Button from "@/components/ui/Button";
import { api } from "@/services/api";

const Navbar: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const keepAlive = async () => {
      try {
        await api.get("/active-users");
      } catch (err) {
        console.error("Presence ping failed:", err);
      }
    };

    keepAlive();
    const interval = setInterval(keepAlive, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-white text-gray-900 border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-0 relative">
      {/* Left — Logo */}
      <div className="text-xl font-semibold tracking-tight text-blue-600">
        Soceyo
      </div>

      {/* Center — Nav links (text only) */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm sm:text-base font-medium">
        <Link
          href="/feed"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Home size={18} className="text-blue-500" />
          <span>Feed</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors"
        >
          <User size={18} className="text-green-500" />
          <span>Profile</span>
        </Link>

        <Link
          href="/messages"
          className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <MessageCircle size={18} className="text-indigo-500" />
          <span>Messages</span>
        </Link>
      </div>

      {/* Right — Logout (still a button with confirmation) */}
      <div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm sm:text-base font-medium transition-colors"
        >
          <LogOut size={18} />
          <span></span>
        </button>
      </div>

      {/* Logout Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to end this session?
            </h2>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleLogoutConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium"
              >
                Yes
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 text-sm font-medium"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;