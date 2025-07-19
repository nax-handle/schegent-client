import Cookies from "js-cookie";
import { axiosInstance } from "./axios";
export interface AuthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  };
}

export function getAuthToken(): string | undefined {
  return Cookies.get("token");
}

export function setAuthTokens(accessToken: string) {
  Cookies.set("token", accessToken);
}
export function setAuthRefreshToken(refreshToken: string) {
  Cookies.set("refreshToken", refreshToken);
}

export function getSessionId(): string | undefined {
  return Cookies.get("sessionId");
}

export function setSessionId(sessionId: string) {
  Cookies.set("sessionId", sessionId);
}

export function clearSessionId() {
  Cookies.remove("sessionId");
}

export function clearAuthTokens() {
  Cookies.remove("token");
}

export function clearAuthRefreshToken() {
  Cookies.remove("refreshToken");
}

export function getCookie() {
  return Cookies.get("accessToken");
}
export function setUserID(userID: string): void {
  localStorage.setItem("userID", userID);
}

export function getUserID(): string | null {
  return localStorage.getItem("userID");
}

export interface GoogleCallbackRequest {
  code: string;
}

export const authService = {
  initiateGoogleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },

  googleCallback: async (
    data: GoogleCallbackRequest
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.get(
      `/auth/google/callback?code=${data.code}`
    );
    return response.data;
  },
};
