type Reminder = {
  datetime: string | Date;
  [key: string]: unknown;
};

type Task = {
  createdAt: string | Date;
  dueDate?: string | Date;
  reminders: Reminder[];
  [key: string]: unknown;
};

export function loadTasksFromStorage(): Task[] {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  return tasks.map((task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    completed: task.completed,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    reminders: task.reminders || [],
  }));
}

export const saveTasksToStorage = (tasks: unknown[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};
