"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  connectSocket,
  sendSocketMessage,
  disconnectSocket,
} from "@/services/socket";
import {
  PaperClipIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";

interface FileData {
  file_id: string;
  url: string;
  file_type: string;
  size?: number;
}
interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  username?: string;
  user_profile_url?: string;
  files?: FileData[];
  status?: "sent" | "delivered" | "seen";
}

export default function MessagePage() {
  const searchParams = useSearchParams();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [editMessageId, setEditMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: string }>({ open: false });
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [removeEditFileConfirm, setRemoveEditFileConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Helper: sort messages by timestamp ascending and remove duplicates by message_id
  const sortAndUniqueMessages = (msgs: Message[]) => {
    const map = new Map<string, Message>();
    // keep last occurrence for each message_id
    msgs.forEach((m) => map.set(m.message_id, m));
    const unique = Array.from(map.values());
    unique.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return unique;
  };

  
  // Smart auto-scroll
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const prevMessagesRef = useRef<Message[]>([]);
  
  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distanceFromBottom < 150; // px threshold
    setIsNearBottom(near);
    if (near) setNewMessageCount(0);
  };
  
  // When messages change, decide whether to auto-scroll or show indicator
  useEffect(() => {
    const prev = prevMessagesRef.current;
    const added = messages.length > prev.length;
    // Update stored messages regardless
    prevMessagesRef.current = messages;
  
    if (!added) return;
  
    if (isNearBottom) {
      // scroll to bottom smoothly
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // show new message count indicator
      setNewMessageCount((n) => n + (messages.length - prev.length));
    }
  }, [messages, isNearBottom]);

  // Load data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [users, convos] = await Promise.all([
          getActiveUsers(),
          listUserConversations(),
        ]);
        setActiveUsers(users);
        setConversations(convos);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchAll();
    
  }, []);

  // Handle userId parameter from URL (e.g., from friends page message button)
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (!userId || conversations.length === 0 || isCreatingConversation) return;

    // Check if conversation with this user already exists
    const existingConv = conversations.find((conv) =>
      conv.members.some((m) => m.user_id === userId)
    );

    if (existingConv) {
      // Select existing conversation
      handleSelectConversation(existingConv);
    } else {
      // Create new conversation with this user
      setIsCreatingConversation(true);
      createConversation([userId])
        .then((newConv) => {
          setConversations((prev) => [newConv, ...prev]);
          handleSelectConversation(newConv);
        })
        .catch((err) => {
          console.error("Failed to create conversation:", err);
        })
        .finally(() => {
          setIsCreatingConversation(false);
        });
    }
  }, [searchParams, conversations, isCreatingConversation]);

  // 🟢 Real-time active user updates (quiet 5s polling)
useEffect(() => {
  let stopped = false;

  const refreshActive = async () => {
    try {
      const latest = await getActiveUsers();
      // Only update if something actually changed — prevents flicker
      setActiveUsers(prev => {
        const prevIds = prev.map(u => u.user_id).sort().join(',');
        const newIds = latest.map(u => u.user_id).sort().join(',');
        return prevIds === newIds ? prev : latest;
      });
    } catch (err) {
      console.error("Failed to refresh active users:", err);
    }
  };

  // Run once immediately and then every 5 seconds
  refreshActive();
  const interval = setInterval(() => {
    if (!stopped) refreshActive();
  }, 5000);

  return () => {
    stopped = true;
    clearInterval(interval);
  };
}, []);

  const fetchMessages = async (conversationId: string) => {
    try {
      const data = await getConversationMessages(conversationId);
      // Sort messages by timestamp ascending (oldest first, like Facebook Messenger)
      const sortedData = [...data].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const msgWithStatus = sortedData.map((m: Message) => ({
        ...m,
        status:
          m.sender_id === localStorage.getItem("user_id") ? ("seen" as const) : undefined,
      }));
  setMessages((prev) => sortAndUniqueMessages([...prev, ...msgWithStatus]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setSidebarOpen(false);
    fetchMessages(conv.conversation_id);
    setFile(null);
    setFilePreview(null);
  };

  // Socket
  useEffect(() => {
    if (!selectedConversation) return;
    if (wsRef.current) disconnectSocket();

    const socket = connectSocket(selectedConversation.conversation_id);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.error) {
          const incoming: Message = {
            ...data,
            status:
              data.sender_id === localStorage.getItem("user_id")
                ? ("sent" as const)
                : undefined,
          };
          setMessages((prev) => {
            const exists = prev.find((m) => m.message_id === incoming.message_id);
            if (exists) {
              // replace existing message (edited/echo)
              return prev.map((m) => (m.message_id === incoming.message_id ? incoming : m));
            }
            // append to bottom
            return [...prev, incoming];
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    return () => {
      disconnectSocket();
      wsRef.current = null;
    };
  }, [selectedConversation]);

  // File preview choose
  const handleFileSelect = (f: File | null) => {
    setFile(f);
    if (f) {
      const previewUrl = URL.createObjectURL(f);
      setFilePreview(previewUrl);
    } else setFilePreview(null);
  };

  // Send message
  const handleSend = async () => {
    if (!selectedConversation) return;
    if (!newMessage.trim() && !file) return;
    try {
      const res = await sendMessage(
        selectedConversation.conversation_id,
        newMessage.trim(),
        file || undefined
      );
      setMessages((prev) => {
        const sent = { ...res, status: "sent" } as Message;
        const exists = prev.find((m) => m.message_id === sent.message_id);
        if (exists) return prev.map((m) => (m.message_id === sent.message_id ? sent : m));
        return [...prev, sent];
      });
      setNewMessage("");
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(null);
      setFile(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Edit
  const handleEditMessage = (msg: Message) => {
    setEditMessageId(msg.message_id);
    setEditMessageContent(msg.content);
    setEditFile(null);
    setEditPreview(null);
  };
  const handleEditFileSelect = (f: File | null) => {
    setEditFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setEditPreview(url);
    } else setEditPreview(null);
  };
  const handleSaveEdit = async () => {
    if (!editMessageId || !selectedConversation) return;
    try {
      const updated = await updateMessage(
        editMessageId,
        editMessageContent,
        editFile || undefined
      );
      setMessages((prev) => sortAndUniqueMessages(prev.map((m) => (m.message_id === editMessageId ? { ...m, ...updated, status: "seen" } : m))));
      setEditMessageId(null);
      setEditMessageContent("");
      setEditFile(null);
      if (editPreview) URL.revokeObjectURL(editPreview);
      setEditPreview(null);
    } catch (e) {
      console.error(e);
    }
  };
  
  // Open delete confirmation modal
  const handleDeleteMessage = (id: string) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDeleteMessage = async () => {
    const id = deleteModal.id;
    if (!id) return setDeleteModal({ open: false });
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.message_id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteModal({ open: false });
    }
  };

  const cancelDeleteMessage = () => setDeleteModal({ open: false });

  // Confirm save edit
  const requestSaveEdit = () => setEditConfirmOpen(true);
  const confirmSaveEdit = async () => {
    setEditConfirmOpen(false);
    await handleSaveEdit();
  };
  const cancelSaveEdit = () => setEditConfirmOpen(false);

  // Confirm remove edit file
  const requestRemoveEditFile = () => setRemoveEditFileConfirm(true);
  const confirmRemoveEditFile = () => {
    setRemoveEditFileConfirm(false);
    handleEditFileSelect(null);
  };
  const cancelRemoveEditFile = () => setRemoveEditFileConfirm(false);
  // (original delete handler replaced by modal flow)

  const handleDeleteConversation = async (id: string) => {
    if (!confirm("Delete conversation?")) return;
    try {
      await deleteConversation(id);
      setConversations((p) => p.filter((c) => c.conversation_id !== id));
      if (selectedConversation?.conversation_id === id) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Image viewer handling
  const openViewer = (url: string) => setViewerImage(url);
  const closeViewer = () => setViewerImage(null);

  // UI
  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`absolute sm:static z-20 bg-white border-r border-gray-200 w-72 sm:w-64 p-3 overflow-y-auto transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <h2 className="text-sm font-semibold mb-1 text-gray-700">
            Active Users
          </h2>
          {activeUsers.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No active users</p>
          ) : (
            activeUsers.map((u) => (
              <div
                key={u.user_id}
                onClick={async () => {
  try {
    // Check if a conversation with this user already exists
    const existing = conversations.find(c =>
      c.members.some((m: any) => m.user_id === u.user_id)
    );
    if (existing) {
      handleSelectConversation(existing);
      return;
    }

    // Otherwise create a new one
    const newConv = await createConversation([u.user_id]);
    setConversations(prev => [newConv, ...prev]);
    handleSelectConversation(newConv);
  } catch (err) {
    console.error("Error creating conversation:", err);
    alert("Failed to start conversation.");
  }
}}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    u.is_active ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <img
                  src={u.user_profile_url || "/default-avatar.png"}
                  alt={u.username}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm text-gray-800 truncate">
                  {u.username}
                </span>
              </div>
            ))
          )}
          <h2 className="text-sm font-semibold mt-4 mb-1 text-gray-700">
            Conversations
          </h2>
          {conversations.map((conv) => (
            <div
              key={conv.conversation_id}
              className={`p-2 hover:bg-indigo-50 rounded cursor-pointer ${
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
                className="text-xs text-red-500 hover:text-red-700 ml-8 mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </aside>

        {/* Main chat */}
        <main className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 p-3 flex items-center bg-white">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded"
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
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base truncate ml-2">
              {selectedConversation
                ? selectedConversation.members
                    .map((m) => m.username)
                    .join(", ")
                : "Select a conversation"}
            </h2>
          </header>

          {/* Messages */}
          <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => {
              const isMine = msg.sender_id === localStorage.getItem("user_id");
              return (
                <div
                  key={msg.message_id}
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  <div className={`flex ${isMine ? "justify-end" : "justify-start"} w-full`}>
                    {!isMine && (
                      <img
                        src={msg.user_profile_url || "/default-avatar.png"}
                        alt={msg.username}
                        className="w-8 h-8 rounded-full object-cover mr-2 self-start"
                      />
                    )}
                    <div className="flex flex-col max-w-[75%] sm:max-w-md break-words">
                      {!isMine && (
                        <p className="text-xs text-gray-600 mb-1 font-medium ml-1">
                          {msg.username}
                        </p>
                      )}
                      <div
                        className={`p-3 rounded-2xl shadow-sm break-words ${
                          isMine
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {editMessageId === msg.message_id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={editMessageContent}
                              onChange={(e) =>
                                setEditMessageContent(e.target.value)
                              }
                              className="border rounded px-2 py-1 text-black resize-none"
                              rows={4}
                            />
                            <input
                              ref={editFileInputRef}
                              type="file"
                              onChange={(e) =>
                                handleEditFileSelect(e.target.files?.[0] || null)
                              }
                              className="text-xs text-gray-600"
                            />
                            {editPreview && (
                              <div className="relative mt-1">
                                <img
                                  src={editPreview}
                                  className="max-w-[150px] rounded"
                                />
                                <button
                                  onClick={() => requestRemoveEditFile()}
                                  className="absolute top-0 right-0 bg-white text-red-600 rounded-full p-[1px]"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            <Button
                              onClick={requestSaveEdit}
                              className="bg-indigo-700 text-white text-xs px-3 py-1 rounded-full self-end"
                            >
                              Done
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            {msg.files &&
                              msg.files.map((f) =>
                                f.file_type.startsWith("image/") ? (
                                  <img
                                    key={f.file_id}
                                    src={f.url}
                                    alt="attachment"
                                    className="max-w-[200px] mt-2 rounded-lg cursor-pointer hover:opacity-90"
                                    onClick={() => openViewer(f.url)}
                                  />
                                ) : (
                                  <a
                                    key={f.file_id}
                                    href={f.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block mt-1 text-sm underline"
                                  >
                                    {f.url.split("/").pop()}
                                  </a>
                                )
                              )}
                          </>
                        )}
                      </div>
                      {isMine && editMessageId !== msg.message_id && (
                        <div className="flex gap-3 mt-1 justify-end">
                          <button
                            onClick={() => handleEditMessage(msg)}
                            className="text-yellow-500 hover:text-yellow-400"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.message_id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {isMine && (
                      <img
                        src={msg.user_profile_url || "/default-avatar.png"}
                        alt={msg.username}
                        className="w-8 h-8 rounded-full ml-2 self-start"
                      />
                    )}
                  </div>
                  {isMine && (
                    <div className="text-[11px] text-gray-400 mt-1 pr-2">
                      {msg.status === "seen"
                        ? "Seen"
                        : msg.status === "delivered"
                        ? "Delivered"
                        : "Sent"}
                      <span className="ml-2">
                        {format(new Date(msg.timestamp), "p")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
              <div ref={bottomRef} />

              {newMessageCount > 0 && (
                <button
                  onClick={() => {
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                    setNewMessageCount(0);
                    setIsNearBottom(true);
                  }}
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full shadow-lg text-sm"
                >
                  {newMessageCount} new
                </button>
              )}
          </div>

          {/* File preview before send */}
          {selectedConversation && (
            <div className="border-t border-gray-200 p-3 flex flex-col bg-white">
              {filePreview && (
                <div className="flex items-center gap-2 p-2 border rounded mb-2 bg-gray-50 relative max-w-[200px]">
                  {file?.type.startsWith("image/") ? (
                    <img
                      src={filePreview}
                      alt="preview"
                      className="max-h-24 rounded"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 truncate max-w-[150px]">
                      {file?.name}
                    </p>
                  )}
                  <button
                    onClick={() => handleFileSelect(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-[1px]"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-600 hover:text-indigo-600"
                >
                  <PaperClipIcon className="w-5 h-5" />
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium w-auto ml-1"
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Image viewer modal */}
      {viewerImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <img
            src={viewerImage}
            alt="viewer"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelDeleteMessage} />
          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Delete message</h3>
            <p className="text-base text-gray-700 mb-4">Are you sure you want to delete this message?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteMessage}
                className="px-4 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {editConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelSaveEdit} />
          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Save changes</h3>
            <p className="text-base text-gray-700 mb-4">Save changes to this message?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelSaveEdit}
                className="px-4 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmSaveEdit}
                className="px-4 py-2 rounded bg-indigo-700 text-white hover:bg-indigo-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {removeEditFileConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={cancelRemoveEditFile} />
          <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Remove attachment</h3>
            <p className="text-base text-gray-700 mb-4">Remove the attached file from this message?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelRemoveEditFile}
                className="px-4 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmRemoveEditFile}
                className="px-4 py-2 rounded bg-yellow-600 text-black hover:bg-yellow-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}