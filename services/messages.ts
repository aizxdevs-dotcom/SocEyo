import { api } from "./api";

/**
 * Works with backend endpoints prefixed by /api in main.py
 *   POST   /api/messages
 *   GET    /api/conversations/{conversation_id}/messages
 *   PUT    /api/messages/{message_id}
 *   DELETE /api/messages/{message_id}
 */

export const sendMessage = async (
  conversationId: string,
  content: string,
  upload?: File
) => {
  const form = new FormData();
  form.append("conversation_id", conversationId);
  if (content) form.append("content", content);
  if (upload) form.append("upload", upload);

  const res = await api.post("/messages", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getConversationMessages = async (conversationId: string) => {
  // one /api only
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return res.data;
};

export const updateMessage = async (
  messageId: string,
  content?: string,
  upload?: File
) => {
  const form = new FormData();
  if (content) form.append("content", content);
  if (upload) form.append("upload", upload);

  const res = await api.put(`/messages/${messageId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteMessage = async (
  messageId: string,
  deleteContent = true,
  deleteFiles = true
) => {
  const res = await api.delete(
    `/messages/${messageId}?delete_content=${deleteContent}&delete_files=${deleteFiles}`
  );
  return res.data;
};