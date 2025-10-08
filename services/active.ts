import { api } from "@/services/api";

export interface ActiveUser {
  user_id: string;
  username: string;
  user_profile_url?: string;
  is_active: boolean;
}

// ✅ Fetch all active users (public endpoint)
export const getActiveUsers = async (): Promise<ActiveUser[]> => {
  try {
    // call correct endpoint since backend = /api/api/active-users
    const res = await api.get<ActiveUser[]>("/api/active-users");
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching active users:", error);
    return [];
  }
};
