import { axiosInstance } from "../axios";
import { getAuthToken, getSessionId } from "../auth";

interface ChatbotRequest {
  message: string;
}

export interface SuggestedEvent {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  hangoutLink: string;
  recurrence: string;
  icon: string;
  visibility: string;
  status: "confirmed" | "tentative" | "cancelled";
  priority: "low" | "medium" | "high";
  eventCategory: "general" | "habit" | "task";
  colorId: string;
  isAllDay: boolean;
  calendarId: string;
}

interface ChatbotResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    events_data: SuggestedEvent[];
    response: string;
  };
}

const API_ENDPOINTS = {
  CHATBOT: "/chatbot",
} as const;

export async function sendMessage(
  data: ChatbotRequest
): Promise<ChatbotResponse> {
  const token = getAuthToken();
  const sessionID = getSessionId();

  const { data: response } = await axiosInstance.post<ChatbotResponse>(
    API_ENDPOINTS.CHATBOT,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );

  return response;
}
