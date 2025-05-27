import axios from "axios";
import Cookies from "js-cookie";
import { getAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axiosInstance.post<AuthResponse>(
          "/auth/refresh",
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (accessToken) {
          Cookies.set("accessToken", accessToken, { expires: 7 });
          Cookies.set("refreshToken", newRefreshToken, { expires: 7 });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);
