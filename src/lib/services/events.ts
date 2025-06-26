import { axiosInstance } from "../axios";
import { SendEvent, ResponseEvent } from "@/types";

const API_ENDPOINTS = {
  CREATE: "/event/create",
  ALL: "/event/",
  GETEVENT: "/event",
  GETALL: "/event/calendar/",
};

// This function creates a new event
export async function createEvent(data: SendEvent): Promise<SendEvent> {
  const { data: response } = await axiosInstance.post<SendEvent>(
    API_ENDPOINTS.CREATE,
    data
  );
  return response;
}

// This function gets all events
export async function getAllEvents(): Promise<ResponseEvent> {
  const { data: response } = await axiosInstance.get<ResponseEvent>(
    API_ENDPOINTS.GETEVENT
  );
  return response;
}

// This function gets detail events
export async function getDetailEvents(id: string) {
  const { data: response } = await axiosInstance.get(API_ENDPOINTS.ALL + id);
  return response;
}

// This function gets all events by calendar ID
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

// This function updates an existing event
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

// This function deletes an event by its ID
export async function deleteEvent(id: string): Promise<void> {
  await axiosInstance.delete(`${API_ENDPOINTS.ALL}${id}`);
}
