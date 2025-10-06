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
        // With NEXT_PUBLIC_API_BASE_URL="https://soceyo.onrender.com/api"
        await api.get("/active-users");
      } catch (err) {
        console.error("Presence ping failed:", err);
      }
    };

    keepAlive();                                // mark active immediately
    const interval = setInterval(keepAlive, 60_000); // refresh TTL every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white text-gray-900 border-b border-gray-200 shadow-sm relative">
      {/* Left side — Title / logo */}
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold tracking-tight">Soceyo</span>
      </div>

      {/* Center — Navigation links */}
      <div className="flex items-center space-x-4">
        <Link href="/feed">
          <Button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow">
            <Home size={18} />
            <span>Feed</span>
          </Button>
        </Link>

        <Link href="/profile">
          <Button className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium shadow">
            <User size={18} />
            <span>Profile</span>
          </Button>
        </Link>

        <Link href="/messages">
          <Button className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium shadow">
            <MessageCircle size={18} />
            <span>Messages</span>
          </Button>
        </Link>
      </div>

      {/* Right side — Logout button */}
      <Button
        onClick={() => setShowDialog(true)}
        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm font-medium shadow"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </Button>

      {/* Logout confirmation dialog with blurred background */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
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