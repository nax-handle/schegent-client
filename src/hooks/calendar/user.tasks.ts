import { useMutation, useQuery } from "@tanstack/react-query";
import * as tasks from "@/lib/services/tasks";
import { SendTask } from "@/types";

// Create a new task
export const useCreateTask = () => {
  const mutation = useMutation({
    mutationFn: tasks.createTask,
  });
  return {
    createTask: mutation.mutate,
    createTaskError: mutation.error,
    isCreatingTask: mutation.isPending,
    isTaskCreated: mutation.isSuccess,
  };
};

// Get all tasks
export const useGetAllTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: tasks.getAllTasks,
    select: (res) => res.data,
  });
};

// get tasks by id
export const useGetTaskById = (id: string) => {
  return useQuery({
    queryKey: ["taskDetail", id],
    queryFn: () => tasks.getTaskById(id),
    select: (res) => res,
    enabled: !!id,
  });
};

// Update an existing task
export const useUpdateTask = () => {
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: SendTask; id: string }) =>
      tasks.updateTask(data, id),
  });
  return {
    updateTask: mutation.mutate,
    updateTaskError: mutation.error,
    isUpdatingTask: mutation.isPending,
    isTaskUpdated: mutation.isSuccess,
  };
};

// Delete a task
export const useDeleteTask = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => tasks.deleteTask(id),
  });
  return {
    deleteTask: mutation.mutate,
    deleteTaskError: mutation.error,
    isDeletingTask: mutation.isPending,
    isTaskDeleted: mutation.isSuccess,
  };
};
