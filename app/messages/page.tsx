"use client";

import React, { useEffect, useState } from "react";
import { getActiveUsers } from "@/services/active";
import {
  listUserConversations,
  createConversation,
  deleteConversation,
  Conversation,
} from "@/services/conversation";
import {
  getConversationMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "@/services/messages";
import Button from "@/components/ui/Button";
import Navbar from "@/components/Navbar";
import { connectSocket, sendSocketMessage, disconnectSocket } from "@/services/socket";

interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  username?: string;
  user_profile_url?: string;
}

export default function MessagePage() {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [editMessageId, setEditMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch active users + conversations
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [users, convos] = await Promise.all([
          getActiveUsers(),
          listUserConversations(),
        ]);
        setActiveUsers(users);
        setConversations(convos);
      } catch (error) {
        console.error("❌ fetchAll error:", error);
      }
    };
    fetchAll();
  }, []);

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await getConversationMessages(conversationId);
      setMessages(res);
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      const newConvo = await createConversation([userId], false);
      if (newConvo) {
        setConversations((prev) => [newConvo, ...prev]);
        setSelectedConversation(newConvo);
      }
    } catch (error) {
      console.error("❌ Error starting chat:", error);
    }
  };

  // 🗑 Delete a conversation
  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((c) => c.conversation_id !== conversationId)
      );
      if (selectedConversation?.conversation_id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error deleting conversation:", error);
    }
  };

  // ✏️ Start editing a message
  const handleEditMessage = (msg: Message) => {
    setEditMessageId(msg.message_id);
    setEditMessageContent(msg.content);
  };

  // ✅ Save edited message
  const handleSaveEdit = async () => {
    if (!editMessageId || !selectedConversation) return;
    try {
      await updateMessage(editMessageId, editMessageContent);
      setEditMessageId(null);
      setEditMessageContent("");
      fetchMessages(selectedConversation.conversation_id);
    } catch (error) {
      console.error("❌ Error updating message:", error);
    }
  };

  // ❌ Delete a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.message_id !== messageId));
    } catch (error) {
      console.error("❌ Error deleting message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* ----- Sidebar ----- */}
        <aside
          className={`absolute sm:static z-20 top-0 left-0 bg-white border-r border-gray-200 w-72 sm:w-64 flex-shrink-0 h-full p-3 overflow-y-auto transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          {/* Active Users */}
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
                  onClick={() => handleStartChat(user.user_id)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
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

          {/* Conversations */}
          <h2 className="text-sm font-semibold text-gray-700 mt-4 mb-2">
            Conversations
          </h2>
          {conversations.map((conv) => (
            <div
              key={conv.conversation_id}
              className={`p-2 rounded hover:bg-indigo-50 cursor-pointer ${
                selectedConversation?.conversation_id === conv.conversation_id
                  ? "bg-indigo-100"
                  : ""
              }`}
            >
              <div
                onClick={() => handleSelectConversation(conv)}
                className="flex items-center gap-2"
              >
                {conv.members.map((m) => (
                  <img
                    key={m.user_id}
                    src={m.user_profile_url || "/default-avatar.png"}
                    alt={m.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ))}
                <span className="text-sm font-medium text-gray-800 truncate">
                  {conv.members.map((m) => m.username).join(", ")}
                </span>
              </div>
              <button
                onClick={() => handleDeleteConversation(conv.conversation_id)}
                className="text-xs text-red-500 hover:text-red-700 mt-1 ml-8"
              >
                Delete
              </button>
            </div>
          ))}
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ----- Main chat area ----- */}
        <main className="flex-1 flex flex-col h-full">
          {/* Header */}
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

          {/* Messages */}
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
                    className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-md text-sm shadow break-words relative ${
                      msg.sender_id === localStorage.getItem("user_id")
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {editMessageId === msg.message_id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editMessageContent}
                          onChange={(e) => setEditMessageContent(e.target.value)}
                          className="w-full border rounded px-2 text-gray-900"
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-500 font-semibold text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}

                    {msg.sender_id === localStorage.getItem("user_id") && (
                      <div className="absolute -top-2 right-0 flex gap-2">
                        <button
                          onClick={() => handleEditMessage(msg)}
                          className="text-xs text-yellow-300 hover:text-yellow-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.message_id)}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
