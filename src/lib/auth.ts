import Cookies from "js-cookie";

export function getAuthToken(): string | undefined {
  return Cookies.get("accessToken");
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", accessToken, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
}

export function clearAuthTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

export function getRefreshToken(): string | undefined {
  return Cookies.get("refreshToken");
}
