// app/services/message.ts
import { api } from "./api";

export const sendMessage = async (conversationId: string, content: string) => {
  const res = await api.post("/api/api/messages", {
    conversation_id: conversationId,
    content,
  });
  return res.data;
};

export const getConversationMessages = async (conversationId: string) => {
  const res = await api.get(`/api/api/conversations/${conversationId}/messages`);
  return res.data;
};

export const updateMessage = async (messageId: string, content: string) => {
  const res = await api.put(`/api/api/messages/${messageId}`, { content });
  return res.data;
};

export const deleteMessage = async (messageId: string) => {
  const res = await api.delete(`/api/api/messages/${messageId}`);
  return res.data;
};
