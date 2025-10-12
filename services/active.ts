import { api } from "@/services/api";

export interface ActiveUser {
  user_id: string;
  username: string;
  user_profile_url?: string;
  is_active: boolean;
}

export const getActiveUsers = async (): Promise<ActiveUser[]> => {
  try {
    const res = await api.get<ActiveUser[]>("/active-users");
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching active users:", error);
    return [];
  }
};