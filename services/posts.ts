import { api } from "./api";

export interface Post {
  post_id: string;        // ✅ UUID from backend
  description: string;
  created_at: string;
  user_id: string;
  username?: string;
  email?: string;
  user_profile_url?: string | null; 
  files: {
    file_id: string;
    url: string;
    file_type: string;
    size: number;
  }[];
}

export interface CommentResponse {
  comment_id: string;
  description: string;
  created_at: string;
  user_id: string;
  post_id: string;
  files: {
    file_id: string;
    url: string;
    file_type: string;
    size: number;
  }[];
  reactions?: Record<string, number>;
  current_user_reaction?: string | null;
}

export const createPost = async (formData: FormData) => {
  const res = await api.post("/posts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getPost = async (post_id: string): Promise<Post> => {
  const res = await api.get<Post>(`/posts/${post_id}`);
  return res.data;
};

export const updatePost = async (post_id: string, description: string) => {
  const res = await api.put(`/posts/${post_id}`, { description });
  return res.data;
};

export const deletePost = async (post_id: string) => {
  const res = await api.delete(`/posts/${post_id}`);
  return res.data;
};

export const getFeed = async () => {
  const res = await api.get<Post[]>("/feed");
  return res.data;
};

// ---- Comments ----
// ---- Comments ----
export const addComment = async (postId: string, description: string) => {
  try {
    // Build payload dynamically
    const payload: Record<string, any> = {
      post_id: postId,
      description,
    };

    // Don't send file_ids at all if not needed
    // Backend already accepts comments without files

    const res = await api.post<CommentResponse>("/comments", payload);
    return res.data;
 } catch (error: any) {
    // This gives readable diagnostic output
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const addCommentWithFiles = async (
  postId: string,
  description: string,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("post_id", postId);
  formData.append("description", description);
  files.forEach((file) => formData.append("files", file));

  const res = await api.post<CommentResponse>("/comments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getComments = async (postId: string) => {
  const res = await api.get<CommentResponse[]>(`/posts/${postId}/comments`);
  return res.data;
};

// ---- Reactions ----
export const reactToPost = async (postId: string, type: string) => {
  const res = await api.post("/reactions", {
    post_id: postId,
    type,                        // ✅ match CommentCreate field name
  });
  return res.data;
};

export const getReactions = async (postId: number) => {
  const res = await api.get(`/posts/${postId}/reactions`);
  return res.data;
};