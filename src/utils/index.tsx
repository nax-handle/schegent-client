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
