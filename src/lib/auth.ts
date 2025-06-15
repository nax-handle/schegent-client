export function getAuthToken(): string | undefined {
  const token = localStorage.getItem("accessToken");
  return token === null ? undefined : token;
}

export function setAuthTokens(accessToken: string) {
  localStorage.setItem("accessToken", accessToken);
}

export function clearAuthTokens() {
  localStorage.removeItem("accessToken");
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
