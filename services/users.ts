import { api } from "./api";
import type { Post } from "./posts";

export interface User {
  user_id: string;
  username: string;
  email?: string;
  full_name?: string;
  bio?: string;
  profile_photo?: string;
}

export interface UpdateUser {
  username?: string;
  email?: string;
  bio?: string;
  full_name?: string;
}

export const updateUser = async (id: string, payload: UpdateUser) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

export const uploadProfilePhoto = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/users/${id}/upload-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const res = await api.get<Post[]>(`/users/${userId}/posts`);
  return res.data;
};

export const getAllUsers = async (limit: number = 50): Promise<User[]> => {
  const res = await api.get<User[]>("/users", {
    params: { limit },
  });
  return res.data;
};

export const searchUsers = async (query: string, limit: number = 20): Promise<User[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  const res = await api.get<User[]>("/users/search", {
    params: { q: query, limit },
  });
  return res.data;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const res = await api.get<User>(`/users/${userId}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const deleteAccount = async (userId: string, password: string, reason?: string) => {
  const res = await api.delete(`/users/${userId}/delete`, {
    data: { password, reason }
  });
  return res.data;
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const res = await api.put(`/users/${userId}/password`, {
    current_password: currentPassword,
    new_password: newPassword
  });
  return res.data;
};