import { api } from "./api";
import type { Post } from "./posts";

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