"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { api } from "@/services/api";

interface Notification {
  notification_id: string;
  sender_username: string;
  sender_profile_photo_url?: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Props {
  onClose: () => void;
}

export default function NotificationModal({ onClose }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data || []);
        setHasUnread(res.data?.some((n: Notification) => !n.is_read));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    if (marking || !hasUnread) return;
    setMarking(true);
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setHasUnread(false);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarking(false);
    }
  };

   const markNotificationAsRead = async (notification_id: string) => {
    try {
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification_id ? { ...n, is_read: true } : n
        )
      );
      await api.put(`/notifications/${notification_id}/read`);
      setHasUnread((prev) =>
        notifications.some((n) => !n.is_read && n.notification_id !== notification_id)
      );
    } catch (err) {
      console.error(`Failed to mark notification ${notification_id} as read:`, err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={marking || !hasUnread}
                className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition ${
                  hasUnread
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                {marking ? "Marking..." : "Mark all read"}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications yet</p>
          ) : (
            notifications.map((notif) => (
              <div
  key={notif.notification_id}
  onClick={() => !notif.is_read && markNotificationAsRead(notif.notification_id)}
  className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition ${
    notif.is_read ? "bg-gray-50 hover:bg-gray-100" : "bg-blue-50 hover:bg-blue-100"
  }`}
>
                {/* Sender Avatar */}
                {notif.sender_profile_photo_url ? (
                  <Image
                    src={notif.sender_profile_photo_url}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-semibold">
                      {notif.sender_username?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}

                {/* Notification Info */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-semibold">
                      {notif.sender_username}
                    </span>{" "}
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
