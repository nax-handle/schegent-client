export interface HomeProps {
  events: {
    date: number;
    time: string;
    title: string;
    startHour: number;
    duration: number;
  }[];
}

export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  isActive: string | true;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendCalendar {
  name: string;
  description: string;
  colorId: string;
  isPrimary: boolean;
  isShared: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  colorId: string;
  isPrimary: boolean;
  isShared: boolean;
}

export interface ResponseCalendar {
  data: {
    id: string;
    name: string;
    description: string;
    colorId: string;
    isPrimary: boolean;
    isShared: boolean;
  }[];
}

export interface SendEvent {
  title: string;
  description: string;
  location: string | null;
  startTime: string;
  endTime: string;
  hangoutLink: string | null;
  recurrence: string;
  icon: string | null;
  visibility: string;
  status: "confirmed" | "tentative" | "cancelled";
  priority: "low" | "medium" | "high";
  eventCategory: "general" | "habit" | "task";
  colorId: string;
  isAllDay: boolean;
  calendarId: string;
  minutesBefore: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string | null;
  startTime: string;
  endTime: string;
  hangoutLink: string | null;
  recurrence: string;
  icon: string | null;
  visibility: string;
  status: "confirmed" | "tentative" | "cancelled";
  priority: "low" | "medium" | "high";
  eventCategory: "general" | "habit" | "task";
  colorId: string;
  isAllDay: boolean;
  calendarId: string;
}

export interface UpdateEvent {
  id: string;
  data: Partial<SendEvent>;
}

export interface ResponseEvent {
  data: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    startTime: string;
    endTime: string;
    hangoutLink: string | null;
    recurrence: string;
    icon: string | null;
    visibility: string;
    status: "confirmed" | "tentative" | "cancelled";
    priority: "low" | "medium" | "high";
    eventCategory: "general" | "habit" | "task";
    colorId: string;
    isAllDay: boolean;
    calendarId: string;
  }[];
}

export interface Reminder {
  id: string;
  datetime: Date;
  message: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number;
  calendarId?: string;
}

export interface SendTask {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number;
  calendarId?: string;
}

export interface ResponseTask {
  data: {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    startDate?: Date;
    endDate?: Date;
    estimatedDuration?: number;
    calendarId?: string;
  }[];
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
}
