import { axiosInstance } from "../axios";
import { SendCalendar, ResponseCalendar } from "@/types";
import { getAuthToken } from "../auth";

const API_ENDPOINTS = {
  CREATE: "/calendar/create",
  ALL: "/calendar/all",
  UPDATE: "/calendar/",
  DELETE: "/calendar/",
};

// This function creates a new calendar
export async function createCalendar(
  data: SendCalendar
): Promise<SendCalendar> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  console.log("Creating calendar with data:", data);
  const { data: response } = await axiosInstance.post<SendCalendar>(
    API_ENDPOINTS.CREATE,
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

// This function get all calendar
export async function getAllCalendars(): Promise<ResponseCalendar> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  const { data: response } = await axiosInstance.get<ResponseCalendar>(
    API_ENDPOINTS.ALL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-session-id": sessionID,
      },
    }
  );
  return response;
}

// This function updates an existing calendar
export async function updateCalendar(
  data: SendCalendar,
  id: string
): Promise<SendCalendar> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  const { data: response } = await axiosInstance.patch<SendCalendar>(
    API_ENDPOINTS.UPDATE + id,
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

// This function deletes a calendar by its ID
export async function deleteCalendar(id: string): Promise<void> {
  const token = getAuthToken();
  const sessionID = localStorage.getItem("sessionId");
  await axiosInstance.delete(API_ENDPOINTS.DELETE + id, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-session-id": sessionID,
    },
  });
}
