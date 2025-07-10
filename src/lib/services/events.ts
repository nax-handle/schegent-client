import { axiosInstance } from "../axios";
import { SendEvent, ResponseEvent } from "@/types";
import { getUserID } from "../auth";

const API_ENDPOINTS = {
  CREATE: "/event/create",
  CREATE_MULTIPLE: "/event/action",
  ALL: "/event/",
  GETEVENT: "/event",
  GETALL: "/event/calendar/",
  EVENT_AI: "/event/ai/",
};

export async function createEvent(data: SendEvent): Promise<SendEvent> {
  const { data: response } = await axiosInstance.post<SendEvent>(
    API_ENDPOINTS.CREATE,
    data
  );
  return response;
}

export async function getAllEvents(): Promise<ResponseEvent> {
  const { data: response } = await axiosInstance.get<ResponseEvent>(
    API_ENDPOINTS.GETEVENT
  );
  return response;
}

export async function getDetailEvents(id: string) {
  const { data: response } = await axiosInstance.get(API_ENDPOINTS.ALL + id);
  return response;
}

export async function getAllEventsByCalendarId(
  calendarId: string,
  calendarBy: string,
  currentDate?: string
): Promise<ResponseEvent> {
  const params = new URLSearchParams();
  params.append("calendarBy", calendarBy);
  if (currentDate) params.append("currentDate", currentDate);

  const { data: response } = await axiosInstance.get<ResponseEvent>(
    `${
      API_ENDPOINTS.GETALL
    }${calendarId}?${params.toString()}&calendarId=${calendarId}`
  );
  return response;
}

export async function updateEvent(
  data: SendEvent,
  id: string
): Promise<SendEvent> {
  const { data: response } = await axiosInstance.patch<SendEvent>(
    `${API_ENDPOINTS.ALL}${id}`,
    data
  );
  return response;
}

export async function deleteEvent(id: string): Promise<void> {
  await axiosInstance.delete(`${API_ENDPOINTS.ALL}${id}`);
}
export interface ActionEvents {
  events: SendEvent[];
  action: string;
}
export async function actionEvents(data: ActionEvents): Promise<void> {
  console.log("📤 Sending events to API:", data);
  console.log("🌐 API Endpoint:", API_ENDPOINTS.CREATE_MULTIPLE);

  const { data: response } = await axiosInstance.post(
    API_ENDPOINTS.CREATE_MULTIPLE,
    data
  );

  console.log("📥 API Response:", response);
  return response;
}
export async function reminderEvent(): Promise<ResponseEvent> {
  const { data: response } = await axiosInstance.get(
    `${
      API_ENDPOINTS.EVENT_AI
    }${getUserID()}?currentDate=${new Date().toISOString()}&calendarBy=day`
  );
  return response;
}
