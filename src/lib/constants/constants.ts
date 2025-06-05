export const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

export const colors = [
  "border-l-green-500 bg-green-100 bg-opacity-20 dark:bg-green-300",
  "border-l-blue-500 bg-blue-100 bg-opacity-20 dark:bg-blue-300",
  "border-l-red-500 bg-red-100 bg-opacity-20 dark:bg-red-300",
  "border-l-purple-500 bg-purple-100 bg-opacity-20 dark:bg-purple-300",
  "border-l-yellow-500 bg-yellow-100 bg-opacity-20 dark:bg-yellow-300",
  "border-l-pink-500 bg-pink-100 bg-opacity-20 dark:bg-pink-300",
  "border-l-indigo-500 bg-indigo-100 bg-opacity-20 dark:bg-indigo-300",
  "border-l-emerald-500 bg-emerald-100 bg-opacity-20 dark:bg-emerald-300",
];

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
    case "high":
      return "Cao";
    case "medium":
      return "Trung bình";
    case "low":
      return "Thấp";
    default:
      return "Trung bình";
  }
};

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
  return tasks.map((task: any) => ({
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
