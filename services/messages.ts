import { api } from "./api";

export interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  username?: string;
  user_profile_url?: string;
  conversation_id: string;
}

export const sendMessage = async (conversationId: string, content: string) => {
  const res = await api.post<Message>("/api/messages", {
    conversation_id: conversationId,
    content,
  });
  return res.data;
};

export const getConversationMessages = async (conversationId: string) => {
  const res = await api.get<Message[]>(`/api/conversations/${conversationId}/messages`);
  return res.data;
};

export const createConversation = async (title?: string) => {
  const res = await api.post("/conversations", { title });
  return res.data;
};

export const listUserConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};