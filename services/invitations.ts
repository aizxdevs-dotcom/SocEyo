import { api } from "./api";

// =========================================================================
// 📋 Types & Interfaces
// =========================================================================

export interface User {
  user_id: string;
  username: string;
  email?: string;
  full_name?: string;
  bio?: string;
  profile_photo?: string;
}

export interface Invitation {
  sender_uid: string;
  receiver_uid: string;
  sender_username?: string;
  receiver_username?: string;
  sender_profile_photo?: string;
  receiver_profile_photo?: string;
  status: "pending" | "accepted" | "declined";
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationListResponse {
  invitations: Invitation[];
  total: number;
}

export interface InvitationActionResponse {
  message: string;
  sender_uid: string;
  receiver_uid: string;
  status: "accepted" | "declined";
}

export interface Contact {
  friend_uid: string;
  username: string;
  full_name?: string;
  profile_photo?: string;
  bio?: string;
  friendship_since?: string;
}

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
}

export interface FriendStats {
  total_friends: number;
  pending_sent: number;
  pending_received: number;
}

// =========================================================================
// 🚀 API Functions
// =========================================================================

/**
 * Send a friend request to another user
 */
export const sendFriendRequest = async (
  receiverId: string,
  message?: string
): Promise<{ message: string; sender_uid: string; receiver_uid: string; status: string }> => {
  const res = await api.post("/invitations/send", {
    receiver_uid: receiverId,
    message,
  });
  return res.data;
};

/**
 * Get all received friend requests (pending by default)
 */
export const getReceivedInvitations = async (
  statusFilter: "pending" | "accepted" | "declined" = "pending"
): Promise<InvitationListResponse> => {
  const res = await api.get<InvitationListResponse>("/invitations/received", {
    params: { status_filter: statusFilter },
  });
  return res.data;
};

/**
 * Get all sent friend requests (pending by default)
 */
export const getSentInvitations = async (
  statusFilter: "pending" | "accepted" | "declined" = "pending"
): Promise<InvitationListResponse> => {
  const res = await api.get<InvitationListResponse>("/invitations/sent", {
    params: { status_filter: statusFilter },
  });
  return res.data;
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (
  senderUid: string
): Promise<InvitationActionResponse> => {
  const res = await api.post<InvitationActionResponse>(
    `/invitations/${senderUid}/accept`
  );
  return res.data;
};

/**
 * Decline a friend request
 */
export const declineFriendRequest = async (
  senderUid: string
): Promise<InvitationActionResponse> => {
  const res = await api.post<InvitationActionResponse>(
    `/invitations/${senderUid}/decline`
  );
  return res.data;
};

/**
 * Cancel a sent friend request
 */
export const cancelFriendRequest = async (receiverUid: string): Promise<void> => {
  await api.delete(`/invitations/${receiverUid}/cancel`);
};

/**
 * Get all friends (contacts)
 */
export const getAllFriends = async (
  search?: string
): Promise<ContactListResponse> => {
  const res = await api.get<ContactListResponse>("/contacts/", {
    params: search ? { search } : {},
  });
  return res.data;
};

/**
 * Get friend statistics
 */
export const getFriendStats = async (): Promise<FriendStats> => {
  const res = await api.get<FriendStats>("/contacts/stats");
  return res.data;
};

/**
 * Remove a friend (unfriend)
 */
export const removeFriend = async (friendUid: string): Promise<void> => {
  await api.delete(`/contacts/${friendUid}`);
};

/**
 * Get mutual friends with another user
 */
export const getMutualFriends = async (
  otherUid: string
): Promise<{ mutual_friends: Contact[]; count: number }> => {
  const res = await api.get(`/contacts/mutual/${otherUid}`);
  return res.data;
};

/**
 * Check if already friends with a user
 */
export const isFriend = async (userId: string): Promise<boolean> => {
  try {
    const friends = await getAllFriends();
    return friends.contacts.some((c) => c.friend_uid === userId);
  } catch {
    return false;
  }
};
