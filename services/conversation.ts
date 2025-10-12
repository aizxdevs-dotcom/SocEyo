import { api } from "@/services/api";
import { ActiveUser } from "@/services/active";

/**
 * Works with backend endpoints prefixed by /api in main.py
 *   GET    /api/conversations
 *   POST   /api/conversations
 *   DELETE /api/conversations/{conversation_id}
 */

export interface Conversation {
  conversation_id: string;
  is_group: boolean;
  members: ActiveUser[];
}

// 💬 List user conversations
export const listUserConversations = async (): Promise<Conversation[]> => {
  const res = await api.get<Conversation[]>("/conversations");
  return res.data;
};

// ➕ Create a new conversation
export const createConversation = async (
  memberIds: string[],
  isGroup = true
): Promise<Conversation | null> => {
  try {
    const res = await api.post<Conversation>("/conversations", {
      member_ids: memberIds,
      is_group: isGroup,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    return null;
  }
};

// 🗑 Delete conversation
export const deleteConversation = async (conversationId: string) => {
  const res = await api.delete(`/conversations/${conversationId}`);
  return res.data;
};