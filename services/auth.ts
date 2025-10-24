import { api } from "./api";

// ------------------ Types ------------------
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
  id: string;  // backend user_id
  username: string;
  email: string;
  bio?: string;
  photo_url?: string | null;
  full_name?: string;
}

// ------------------ Auth endpoints ------------------

// 🧾 Registration
export const register = async (data: RegisterData): Promise<UserProfile> => {
  const res = await api.post<UserProfile>("/register", data);
  return res.data;
};

// 🔐 Login → store token + fetch ID from /me
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/login", data);
  const { access_token } = res.data;

  // Save JWT for authenticated requests
  localStorage.setItem("access_token", access_token);

  // Immediately fetch profile to get legitimate user_id
  try {
    const me = await getMe();
    localStorage.setItem("user_id", me.id);      // 👈 save for socket use
    localStorage.setItem("username", me.username);
  } catch (err) {
    console.warn("⚠️ Could not fetch /me profile after login:", err);
  }

  return res.data;
};

// ♻️ Refresh token
export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/refresh");
  localStorage.setItem("access_token", res.data.access_token);
  return res.data;
};

// 👤 Fetch authenticated user's profile (used by login above)
export const getMe = async (): Promise<UserProfile> => {
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
    id: data.user_id,
    username: data.username,
    email: data.email,
    bio: data.bio,
    photo_url: data.profile_photo,
    full_name: data.full_name,
  };
};

// ------------------ Email Verification ------------------

// 🔐 Verify email with OTP
export const verifyEmail = async (email: string, otp_code: string): Promise<{ message: string }> => {
  const res = await api.post("/verify-email", { email, otp_code });
  return res.data;
};

// ♻️ Resend OTP code
export const resendOTP = async (email: string): Promise<{ message: string }> => {
  const res = await api.post("/resend-otp", { email });
  return res.data;
};

// ------------------ Password Reset ------------------

// 🔒 Request password reset (sends OTP)
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const res = await api.post("/forgot-password", { email });
  return res.data;
};

// 🔑 Reset password with OTP
export const resetPassword = async (
  email: string,
  otp_code: string,
  new_password: string
): Promise<{ message: string }> => {
  const res = await api.post("/reset-password", { email, otp_code, new_password });
  return res.data;
};