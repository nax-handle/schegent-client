import { axiosInstance } from "../axios";
import Cookies from "js-cookie";
import {
  getAuthToken,
  getSessionId,
  clearSessionId,
  setUserID,
  setAuthTokens,
  setAuthRefreshToken,
  setSessionId,
  clearAuthTokens,
  clearAuthRefreshToken,
} from "../auth";

const isClient = typeof window !== "undefined";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerifyData {
  email: string;
  code: string;
}

interface LoginData {
  email: string;
  password: string;
  type: "email" | "google";
  code?: string;
}

interface UserResponse {
  data: {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    address: string | null;
    isActive: string | true;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface SessionData {
  refresh_token: string;
  user_agent: string;
  ip_address: string;
  device: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
  session_id: string;
}

interface SessionRespone {
  statusCode: number;
  success: boolean;
  message: string;
  data: Record<string, SessionData>;
}

interface AuthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  };
}

interface RevokeSessionData {
  sessionId: string;
}

const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify-email",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  GET_USER: "/auth",
  REVOKE_ALL_SESSIONS: "/auth/session/revoke-all-sessions",
  REVOKE_SESSION: "/auth/session/revoke-session",
  SESSIONS: "/auth/session/sessions",
} as const;

export async function register(data: RegisterData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    data
  );
  return response;
}

export async function verify(data: VerifyData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.VERIFY,
    data
  );
  return response;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const { data: response } = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );
    setAuthTokens(response.data.accessToken);
    setAuthRefreshToken(response.data.refreshToken);
    setSessionId(response.data.sessionId);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  const token = getAuthToken();
  const sessionID = getSessionId();
  await axiosInstance.post(
    API_ENDPOINTS.LOGOUT,
    {
      sessionId: sessionID,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );

  if (isClient) {
    clearSessionId();
    clearAuthTokens();
    clearAuthRefreshToken();
  }
}

export function isAuthenticated(): boolean {
  return isClient ? !!Cookies.get("accessToken") : false;
}

// Profile
export async function getCurrentUser(): Promise<UserResponse> {
  const token = getAuthToken();
  const sessionID = getSessionId();
  const response = await axiosInstance.get<UserResponse>(
    API_ENDPOINTS.GET_USER,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );
  setUserID(response.data.data.id);
  return response.data;
}

export async function revokeAllSessions(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.REVOKE_ALL_SESSIONS);
  clearSessionId();
}

export async function getSessions(): Promise<SessionRespone> {
  const response = await axiosInstance.get<SessionRespone>(
    API_ENDPOINTS.SESSIONS
  );
  return response.data;
}

export async function revokeSession(data: RevokeSessionData): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.REVOKE_SESSION, data);
  if (isClient) {
    const currentSessionId = localStorage.getItem("sessionId");
    if (currentSessionId === data.sessionId) {
      clearSessionId();
    }
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  const token = Cookies.get("accessToken");
  const sessionID = getSessionId();

  if (!token || !sessionID) {
    throw new Error("No valid session found");
  }

  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.LOGIN,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );

  if (isClient) {
    Cookies.set("accessToken", response.data.data.accessToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  return response.data;
}

export async function forgot_password(email: string): Promise<void> {
  const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
  if (isClient) {
    alert("Password reset link has been sent to your email.");
  }
  return response.data;
}

export async function resetPassword(newPassword: string): Promise<void> {
  const token = getAuthToken();
  const sessionID = getSessionId();
  const response = await axiosInstance.post(
    API_ENDPOINTS.RESET_PASSWORD,
    {
      token,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );
  if (isClient) {
    alert("Your password has been reset successfully.");
  }
  return response.data;
}
