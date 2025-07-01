import Cookies from "js-cookie";
export function getAuthToken(): string | undefined {
  Cookies.get("accessToken");
  return Cookies.get("accessToken");
}

export function setAuthTokens(accessToken: string) {
  Cookies.set("accessToken", accessToken);
}

export function getSessionId(): string | null {
  return localStorage.getItem("sessionId");
}

export function setSessionId(sessionId: string) {
  localStorage.setItem("sessionId", sessionId);
}

export function clearSessionId() {
  localStorage.removeItem("sessionId");
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
