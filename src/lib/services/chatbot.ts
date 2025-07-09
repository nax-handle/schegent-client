import { axiosInstance } from "../axios";

interface ChatbotRequest {
  message: string;
}

export interface Events {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  hangoutLink?: string;
  recurrence?: string;
  icon?: string;
  visibility?: string;
  status?: "confirmed" | "tentative" | "cancelled";
  priority: "low" | "medium" | "high";
  eventCategory?: "general" | "habit" | "task";
  colorId?: string;
  isAllDay: boolean;
  calendarId?: string;
}

interface ChatbotResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    eventsData?: Events[];
    response: string;
    action?: string;
  };
}

const API_ENDPOINTS = {
  CHATBOT: "/chatbot",
} as const;

export async function sendMessage(
  data: ChatbotRequest
): Promise<ChatbotResponse> {
  const { data: response } = await axiosInstance.post<ChatbotResponse>(
    API_ENDPOINTS.CHATBOT,
    data
  );

  return response;
}
