"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LogOut,
  MessageCircle,
  User,
  Home,
  Bell,
  BellDot,
  Menu,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { api } from "@/services/api";
import NotificationModal from "@/components/Feed/NotificationModal";

const Navbar: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔔 Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setHasNotification(res.data && res.data.length > 0);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  // 🫧 Keep presence alive
  useEffect(() => {
    const keepAlive = async () => {
      try {
        await api.get("/active-users");
      } catch {
        // No interrupt if fail
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
    <nav className="w-full bg-white border-b border-gray-300 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between relative">
        {/* 🌐 Logo */}
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg sm:text-xl">
          <span className="tracking-tight">Soceyo</span>
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center text-gray-700 hover:text-blue-600 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 🧭 Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-sm md:text-base">
          <Link
            href="/feed"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home size={20} className="text-blue-500" />
            <span>Feed</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            <User size={20} className="text-green-500" />
            <span>Profile</span>
          </Link>

          <Link
            href="/messages"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <MessageCircle size={20} className="text-indigo-500" />
            <span>Messages</span>
          </Link>

          <button
            onClick={() => setShowNotifications(true)}
            className="relative flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors"
          >
            {hasNotification ? (
              <BellDot size={20} className="text-yellow-500" />
            ) : (
              <Bell size={20} className="text-gray-600" />
            )}
            <span>Notifications</span>

            {hasNotification && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* 🚪 Logout */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-inner animate-fadeIn">
          <div className="flex flex-col p-4 space-y-3 text-sm sm:text-base font-medium">
            <Link
              href="/feed"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home size={20} className="text-blue-500" />
              Feed
            </Link>

            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <User size={20} className="text-green-500" />
              Profile
            </Link>

            <Link
              href="/messages"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <MessageCircle size={20} className="text-indigo-500" />
              Messages
            </Link>

            <button
              onClick={() => {
                setShowNotifications(true);
                setMenuOpen(false);
              }}
              className="relative flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors"
            >
              {hasNotification ? (
                <BellDot size={20} className="text-yellow-500" />
              ) : (
                <Bell size={20} className="text-gray-600" />
              )}
              Notifications
              {hasNotification && (
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => {
                setShowDialog(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 🔔 Notification Modal */}
      {showNotifications && (
        <NotificationModal onClose={() => setShowNotifications(false)} />
      )}

      {/* 🚪 Logout Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to end your session and log out?
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={handleLogoutConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium w-full sm:w-auto"
              >
                Yes
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 text-sm font-medium w-full sm:w-auto"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;