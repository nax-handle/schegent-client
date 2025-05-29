import { axiosInstance } from "../axios";
import Cookies from "js-cookie";
import { getAuthToken } from "../auth";

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
  GET_USER: "/auth",
  REFRESH: "/auth/refresh",
  REVOKE_ALL_SESSIONS: "/auth/revoke-all-sessions",
  REVOKE_SESSION: "/auth/revoke-session",
  SESSIONS: "/auth/sessions",
} as const;

const TOKEN_EXPIRY = 7;

export async function register(data: RegisterData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    data
  );
  return response;
}

export async function verify(data: VerifyData): Promise<AuthResponse> {
  console.log("Verifying with data:", {
    ...data,
  });
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.VERIFY,
    data
  );
  return response;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    console.log("Attempting login with data:", {
      ...data,
      password: "[REDACTED]",
    });
    const { data: response } = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      data
    );
    console.log("Login successful:", {
      user: response.data,
    });
    if (isClient) {
      Cookies.set("accessToken", response.data.accessToken, {
        expires: TOKEN_EXPIRY,
      });
      Cookies.set("refreshToken", response.data.refreshToken, {
        expires: TOKEN_EXPIRY,
      });
      localStorage.setItem("sessionId", response.data.sessionId);
    }
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  if (isClient) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("sessionId");
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = Cookies.get("refreshToken");
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REFRESH,
    { refreshToken }
  );
  if (isClient && response.data.accessToken) {
    Cookies.set("accessToken", response.data.accessToken, {
      expires: TOKEN_EXPIRY,
    });
    Cookies.set("refreshToken", response.data.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
    localStorage.setItem("sessionId", response.data.sessionId);
  }
  return response;
}

export function isAuthenticated(): boolean {
  return isClient ? !!Cookies.get("accessToken") : false;
}

export async function getCurrentUser(): Promise<UserResponse> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  const response = await axiosInstance.get<UserResponse>(
    API_ENDPOINTS.GET_USER,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );

  return response.data;
}

export async function revokeAllSessions(): Promise<void> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");

  await axiosInstance.post(
    API_ENDPOINTS.REVOKE_ALL_SESSIONS,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID ?? "",
      },
    }
  );

  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("sessionId");
}

export async function getSessions(): Promise<SessionRespone> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  const response = await axiosInstance.get<SessionRespone>(
    API_ENDPOINTS.SESSIONS,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );
  return response.data;
}

export async function revokeSession(data: RevokeSessionData): Promise<void> {
  const token = getAuthToken();
  await axiosInstance.post(API_ENDPOINTS.REVOKE_SESSION, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-session-id": data.sessionId,
    },
  });
}
