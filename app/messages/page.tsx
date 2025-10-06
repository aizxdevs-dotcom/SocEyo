"use client";

import React, { useEffect, useState } from "react";
import { getConversationMessages, sendMessage, listUserConversations } from "@/services/messages";
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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // -------------------------------------------------------------------
  // Fetch presence + conversations
  // -------------------------------------------------------------------
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [activeRes, convos] = await Promise.all([
          api.get<ActiveUser[]>("/active-users"),
          listUserConversations(),
        ]);
        setActiveUsers(activeRes.data);
        setConversations(convos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEverything();

    const interval = setInterval(fetchEverything, 15000); // refresh presence every 15 s
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------------
  // Load selected conversation messages
  // -------------------------------------------------------------------
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
      {/* -------------- Static Navbar at the top -------------- */}
      <Navbar />

      {/* -------------- Main messenger section -------------- */}
      <div className="flex flex-1 h-full">
      {/* ---------- Left: Active & Inactive Users ---------- */}
      <aside className="w-60 border-r border-gray-200 p-3 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Active Users</h2>
        <div className="space-y-1">
          {activeUsers.length === 0 && (
  <div className="text-gray-400 text-sm italic">No active users</div>
)}
          {activeUsers.map((user) => (
            <div key={user.user_id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
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
              <span className="text-sm text-gray-800 truncate">{user.username}</span>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Conversations</h2>
        {conversations.map((conv) => (
          <div
            key={conv.conversation_id}
            onClick={() => handleSelectConversation(conv)}
            className={`p-2 rounded hover:bg-indigo-50 cursor-pointer ${
              selectedConversation?.conversation_id === conv.conversation_id
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

      {/* ---------- Center: Chat Body ---------- */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            {selectedConversation
              ? selectedConversation.members.map((m) => m.username).join(", ")
              : "Select a conversation"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.message_id}
              className={`flex ${
                msg.sender_id === localStorage.getItem("user_id")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-md text-sm shadow ${
                  msg.sender_id === localStorage.getItem("user_id")
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Input */}
        {selectedConversation && (
          <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium shadow"
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
