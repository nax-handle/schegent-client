import { SendTask, ResponseTask } from "@/types";
import { axiosInstance } from "../axios";

const API_ENDPOINTS = {
  ALL: "/tasks",
};

export async function createTask(data: SendTask): Promise<SendTask> {
  const { data: response } = await axiosInstance.post<SendTask>(
    API_ENDPOINTS.ALL,
    data
  );
  return response;
}

export async function getAllTasks(): Promise<ResponseTask> {
  const { data: response } = await axiosInstance.get<ResponseTask>(
    API_ENDPOINTS.ALL
  );
  return response;
}

export async function updateTask(
  data: SendTask,
  id: string
): Promise<SendTask> {
  const { data: response } = await axiosInstance.patch<SendTask>(
    `${API_ENDPOINTS.ALL}/${id}`,
    data
  );
  return response;
}

export async function deleteTask(id: string): Promise<void> {
  await axiosInstance.delete(`${API_ENDPOINTS.ALL}/${id}`);
}

export async function getTaskById(id: string): Promise<SendTask> {
  const { data: response } = await axiosInstance.get<SendTask>(
    `${API_ENDPOINTS.ALL}/${id}`
  );
  return response;
}
