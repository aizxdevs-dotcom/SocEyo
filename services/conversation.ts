import { api } from "@/services/api";
import { ActiveUser } from "@/services/active";

export interface Conversation {
  conversation_id: string;
  is_group: boolean;
  members: ActiveUser[];
}

// ✅ Fetch all conversations for current user
export const listUserConversations = async (): Promise<Conversation[]> => {
  try {
    const res = await api.get<Conversation[]>("/api/conversations");
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    return [];
  }
};

// ✅ Create new conversation
export const createConversation = async (
  memberIds: string[],
  isGroup = true
): Promise<Conversation | null> => {
  try {
    const res = await api.post<Conversation>("/api/conversations", {
      member_ids: memberIds,
      is_group: isGroup,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    return null;
  }
};

export const deleteConversation = async (conversationId: string) => {
  return api.delete(`/conversations/${conversationId}`);
};

