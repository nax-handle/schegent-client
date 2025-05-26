import { axiosInstance } from "../axios";
import Cookies from "js-cookie";

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

interface User {
  id: string;
  email: string;
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

const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify-email",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  GET_USER: "/auth/user",
  REFRESH: "/auth/refresh",
} as const;

const TOKEN_EXPIRY = 7;

export async function register(data: RegisterData): Promise<AuthResponse> {
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.REGISTER,
    data
  );
  if (isClient) {
    Cookies.set("accessToken", response.data.accessToken, {
      expires: TOKEN_EXPIRY,
    });
    Cookies.set("refreshToken", response.data.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
  }
  return response;
}

export async function verify(data: VerifyData): Promise<AuthResponse> {
  console.log("Verifying with data:", {
    ...data,
    // Do not log sensitive information like OTP in production
  });
  const { data: response } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.VERIFY,
    data
  );
  if (isClient) {
    Cookies.set("accessToken", response.data.accessToken, {
      expires: TOKEN_EXPIRY,
    });
    Cookies.set("refreshToken", response.data.refreshToken, {
      expires: TOKEN_EXPIRY,
    });
  }
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
    }
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data: user } = await axiosInstance.get<User>(API_ENDPOINTS.GET_USER);
  return user;
}

export async function logout(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  if (isClient) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
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
  }
  return response;
}

export function isAuthenticated(): boolean {
  return isClient ? !!Cookies.get("accessToken") : false;
}
