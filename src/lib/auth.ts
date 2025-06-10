import Cookies from "js-cookie";

export function getAuthToken(): string | undefined {
  return Cookies.get("accessToken");
}

export function setAuthTokens(accessToken: string) {
  Cookies.set("accessToken", accessToken, { expires: 7 });
}

export function clearAuthTokens() {
  Cookies.remove("accessToken");
}
