"use client";
import { useState, useEffect } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { EventTypeDialog } from "@/components/events/calendar-dialog";
import type { Task, Calendar, SendTask } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import {
  useGetAllCalendars,
  useDeleteCalendar,
} from "@/hooks/calendar/use.calendar";
import TaskManager from "@/components/tasks/task-manager";
import {
  useGetAllTasks,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/calendar/user.tasks";

export default function TaskManagement() {
  const { t } = useTranslation();
  const [taskTypes, setTaskTypes] = useState<Calendar[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [calendarID, setCalendarID] = useState<string>("");
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false);
  const { data, isLoading } = useGetAllCalendars();
  const { data: dataTasks, isLoading: loadingTasks } = useGetAllTasks();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();
  const { deleteCalendar } = useDeleteCalendar();
  const [editingEventType, setEditingEventType] = useState<Calendar | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setTaskTypes(data);
    }
    if (dataTasks) {
      setTasks(dataTasks);
    }
  }, [data, dataTasks]);

  useEffect(() => {
    console.log("dataTasks from backend:", dataTasks);
  }, [dataTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (type === "column") {
      if (source.index === destination.index) return;

      const newTaskTypes = Array.from(taskTypes);
      const [removed] = newTaskTypes.splice(source.index, 1);
      newTaskTypes.splice(destination.index, 0, removed);

      setTaskTypes(newTaskTypes);
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const newTaskTypeId =
        destination.droppableId === "no-type"
          ? undefined
          : destination.droppableId;

      const movedTask = tasks.find(
        (task) => String(task.id) === String(draggableId)
      );
      if (movedTask) {
        updateTask(
          {
            data: {
              ...movedTask,
              calendarId: newTaskTypeId,
            },
            id: movedTask.id,
          },
          {
            onSuccess: () => {
              setTasks(
                tasks.map((task) =>
                  String(task.id) === String(draggableId)
                    ? { ...task, calendarId: newTaskTypeId }
                    : task
                )
              );
            },
          }
        );
      }
    }
  };

  const getTasksByType = (taskTypeId: string | null) =>
    tasks.filter((task) => String(task.calendarId) === String(taskTypeId));

  const handleCreateTask = (taskData: Partial<SendTask>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || "",
      description: taskData.description || "",
      status: taskData.status || "todo",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      estimatedDuration: taskData.estimatedDuration,
      calendarId: calendarID || "",
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!selectedTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      )
    );
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleDeleteEventType = (eventTypeId: string) => {
    setTasks(tasks.filter((task) => task.id !== eventTypeId));
    setTaskTypes(taskTypes.filter((type) => type.id !== eventTypeId));
    deleteCalendar(eventTypeId);
  };

  const handleCreateEventType = (eventTypeData: Partial<Calendar>) => {
    const newEventType: Calendar = {
      id: Date.now().toString(),
      name: eventTypeData.name || "",
      colorId: eventTypeData.colorId || "bg-gray-500",
      description: eventTypeData.description || "",
      isPrimary: eventTypeData.isPrimary || false,
      isShared: eventTypeData.isShared || false,
    };
    setTaskTypes([...taskTypes, newEventType]);
  };

  const handleUpdateEventType = (eventTypeData: Partial<Calendar>) => {
    if (!editingEventType) return;

    setTaskTypes(
      taskTypes.map((type) =>
        type.id === editingEventType.id ? { ...type, ...eventTypeData } : type
      )
    );
    setEditingEventType(null);
  };

  if (isLoading || loadingTasks) {
    return <div>Đang tải dữ liệu...</div>;
  }
  if (!taskTypes) return <div>Không có thông tin lịch</div>;

  return (
    <div
      className=" p-6 overflow-y-scroll scrollbar-hidden border-none dark:bg-slate-900 bg-slate-50 "
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="md:flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-black">
              {t("Task Management")}
            </h1>
            <p className="dark:text-white text-black mt-2">
              {t("Manage your tasks and task types efficiently.")}
            </p>
          </div>
          <Button
            variant={"decorate"}
            onClick={() => setIsEventTypeDialogOpen(true)}
            className="w-fit dark:text-white "
          >
            <Plus className="w-4 h-4 mr-2 dark:text-white" />
            {t("Add Task Type")}
          </Button>
        </div>

        <TaskManager
          setCalendarID={setCalendarID}
          handleDragEnd={handleDragEnd}
          getTasksByType={getTasksByType}
          taskTypes={taskTypes}
          setIsTaskDialogOpen={setIsTaskDialogOpen}
          setSelectedTask={setSelectedTask}
          setIsEventTypeDialogOpen={setIsEventTypeDialogOpen}
          setEditingEventType={setEditingEventType}
          handleDeleteEventType={handleDeleteEventType}
          handleDeleteTask={handleDeleteTask}
        />

        <TaskDialog
          calendarID={calendarID}
          isOpen={isTaskDialogOpen}
          onClose={() => {
            setIsTaskDialogOpen(false);
            setSelectedTask(null);
          }}
          onSave={selectedTask ? handleUpdateTask : handleCreateTask}
          task={selectedTask}
        />

        <EventTypeDialog
          isOpen={isEventTypeDialogOpen}
          onClose={() => {
            setIsEventTypeDialogOpen(false);
            setEditingEventType(null);
          }}
          eventType={editingEventType}
          handleCreateEventType={handleCreateEventType}
          handleUpdateEventType={handleUpdateEventType}
        />
      </div>
    </div>
  );
}
