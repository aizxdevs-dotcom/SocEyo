import { api } from "./api";

// --- Response data shapes ---
export interface AuthResponse {
  access_token: string;
  token_type?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;                       // local reference (backend `user_id`)
  username: string;
  email: string;
  bio?: string;
  photo_url?: string | null;        // normalized alias of backend `profile_photo`
  full_name?: string;               // backend key `full_name`
}

// --- Auth & User Endpoints ---

export const register = async (data: RegisterData): Promise<UserProfile> => {
  const res = await api.post<UserProfile>("/register", data);
  return res.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/login", data);
  // Persist the access token for subsequent requests
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/refresh");
  return res.data;
};

/**
 * ✅  Fetch the authenticated user's profile.
 * Converts backend keys to frontend‑friendly names.
 */
export const getMe = async (): Promise<UserProfile> => {
  try {
    const res = await api.get("/me");
    const data = res.data as {
      user_id: string;
      username: string;
      email: string;
      bio?: string;
      profile_photo?: string | null;
      full_name?: string;
    };

    return {
      id: data.user_id,               // internal id alias
      username: data.username,
      email: data.email,
      bio: data.bio,
      photo_url: data.profile_photo,  // normalize key name
      full_name: data.full_name,
    };
  } catch (error: any) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};