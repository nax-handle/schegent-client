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

export const colorOptions = [
  { name: "Xanh dương", value: "bg-blue-500" },
  { name: "Xanh lá", value: "bg-green-500" },
  { name: "Tím", value: "bg-purple-500" },
  { name: "Cam", value: "bg-orange-500" },
  { name: "Đỏ", value: "bg-red-500" },
  { name: "Vàng", value: "bg-yellow-500" },
  { name: "Hồng", value: "bg-pink-500" },
  { name: "Xám", value: "bg-gray-500" },
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
