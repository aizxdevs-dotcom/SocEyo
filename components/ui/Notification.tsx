"use client";

import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import axios from "axios";
import NotificationModal from "@/components/Feed/NotificationModal";

export interface Notification {
  notification_id: string;
  receiver_id: string;
  sender_id: string;
  post_id: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_username?: string;
  sender_profile_photo_url?: string;
  post_description?: string;
}

export default function NotificationButton() {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);

  const hasUnread = notifications.some((n) => !n.is_read);

  // 🧠 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setMarking(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const unread = notifications.filter((n) => !n.is_read);

      await Promise.all(
        unread.map((n) =>
          axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.notification_id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    } finally {
      setMarking(false);
    }
  };

  useEffect(() => {
    if (showModal) fetchNotifications();
  }, [showModal]);

  return (
    <div className="relative">
      {/* 🔔 Notification Icon */}
      <button
        onClick={() => setShowModal(true)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        {hasUnread ? (
          <BellDot className="w-6 h-6 text-blue-600" />
        ) : (
          <Bell className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* 🪟 Modal — extracted to another component */}
      {showModal && (
  <NotificationModal onClose={() => setShowModal(false)} />
)}

    </div>
  );
}
