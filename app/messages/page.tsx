"use client";

import React, { useEffect, useState } from "react";
import {
  getConversationMessages,
  sendMessage,
  listUserConversations,
} from "@/services/messages";
import { api } from "@/services/api";
import Button from "@/components/ui/Button";
import Navbar from "@/components/Navbar";

interface ActiveUser {
  user_id: string;
  username: string;
  user_profile_url?: string;
  is_active: boolean;
}

interface Conversation {
  conversation_id: string;
  members: ActiveUser[];
  is_group: boolean;
}

interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  username?: string;
  user_profile_url?: string;
}

export default function MessagePage() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Fetch active users + conversations
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const activeRes = await api.get<ActiveUser[]>("/active-users");
        setActiveUsers(activeRes.data);
        const convos = await listUserConversations();
        setConversations(convos);
      } catch (err) {
        console.error("❌ fetchEverything error:", err);
      }
    };
    fetchEverything();
  }, []);

  // --- Load messages for selected chat
  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await getConversationMessages(conversationId);
      setMessages(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSidebarOpen(false);
    fetchMessages(conversation.conversation_id);
  };

  const handleSend = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    try {
      await sendMessage(selectedConversation.conversation_id, newMessage);
      setNewMessage("");
      fetchMessages(selectedConversation.conversation_id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      {/* ---------- Messenger area ---------- */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* ----- Sidebar (users + convos) ----- */}
        <aside
          className={`absolute sm:static z-20 top-0 left-0 bg-white border-r border-gray-200 w-72 max-w-full sm:w-64 flex-shrink-0 h-full p-3 overflow-y-auto transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Active Users
          </h2>
          <div className="space-y-1">
            {activeUsers.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                No active users
              </div>
            ) : (
              activeUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      user.is_active ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <img
                    src={user.user_profile_url || "/default-avatar.png"}
                    alt={user.username}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-800 truncate">
                    {user.username}
                  </span>
                </div>
              ))
            )}
          </div>

          <h2 className="text-sm font-semibold text-gray-700 mt-4 mb-2">
            Conversations
          </h2>
          {conversations.map((conv) => (
            <div
              key={conv.conversation_id}
              onClick={() => handleSelectConversation(conv)}
              className={`p-2 rounded hover:bg-indigo-50 cursor-pointer ${
                selectedConversation?.conversation_id ===
                conv.conversation_id
                  ? "bg-indigo-100"
                  : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-800">
                {conv.members.map((m) => m.username).join(", ")}
              </span>
            </div>
          ))}
        </aside>

        {/* ----- Overlay for sidebar on mobile ----- */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ----- Main chat area ----- */}
        <main className="flex-1 flex flex-col h-full">
          {/* Chat header */}
          <div className="border-b border-gray-200 p-3 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {selectedConversation
                  ? selectedConversation.members
                      .map((m) => m.username)
                      .join(", ")
                  : "Select a conversation"}
              </h2>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && selectedConversation ? (
              <p className="text-center text-gray-400 text-sm mt-4">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`flex ${
                    msg.sender_id === localStorage.getItem("user_id")
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-md text-sm shadow break-words ${
                      msg.sender_id === localStorage.getItem("user_id")
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message input */}
          {selectedConversation && (
            <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                onClick={handleSend}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium w-auto"
              >
                Send
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}