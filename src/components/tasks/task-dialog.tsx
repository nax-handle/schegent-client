"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, SendTask } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useGetAllCalendars } from "@/hooks/calendar/use.calendar";
import { useCreateTask, useUpdateTask } from "@/hooks/calendar/user.tasks";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  calendarID?: string | null;
  colorId?: string;
}

export function TaskDialog({
  calendarID,
  isOpen,
  onClose,
  onSave,
  task,
}: TaskDialogProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { data: calendarData } = useGetAllCalendars();

  const [formData, setFormData] = useState<Partial<SendTask>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: undefined,
    startDate: undefined,
    endDate: undefined,
    estimatedDuration: undefined,
    calendarId: calendarID || "",
  });

  useEffect(() => {
    if (calendarID) {
      setFormData((prev) => ({
        ...prev,
        calendarId: calendarID,
      }));
    }
  }, [calendarID]);

  useEffect(() => {
    if (task) {
      setFormData((prev) => ({
        ...prev,
        ...task,
        calendarId: task.calendarId ?? prev.calendarId,
      }));
    }
  }, [task]);

  useEffect(() => {
    if (
      !task &&
      calendarData &&
      calendarData.length > 0 &&
      !formData.calendarId
    ) {
      setFormData((prev) => ({
        ...prev,
        calendarId: calendarData[0].id,
      }));
    }
  }, [task, calendarData, formData.calendarId]);

  const handleSave = () => {
    if (!formData.calendarId) {
      console.error("Calendar ID is required");
      return;
    }

    onSave(formData);
    onClose();

    if (task) {
      updateTask(
        { data: formData as SendTask, id: task.id },
        {
          onSuccess: () => onClose(),
          onError: (error) => {
            console.error("Error updating task:", error);
          },
        }
      );
    } else {
      createTask(formData as SendTask, {
        onSuccess: () => onClose(),
        onError: (error) => {
          console.error("Error creating task:", error);
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 scrollbar-hidden"
      >
        <h2 className="text-xl font-semibold mb-4">
          {task ? t("Edit Task") : t("Add Task")}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{t("Title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t("Enter task title")}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="taskType">{t("Task Type")}</Label>
              <Select
                value={formData.calendarId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    calendarId: value === "none" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue placeholder={t("Select task type")} />
                </SelectTrigger>
                <SelectContent>
                  {calendarData?.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${type.colorId}`}
                        />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t("Status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "todo" | "in-progress" | "done") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{t("Todo")}</SelectItem>
                  <SelectItem value="in-progress">
                    {t("In Progress")}
                  </SelectItem>
                  <SelectItem value="done">{t("Done")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">{t("Priority")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select priority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("Low")}</SelectItem>
                  <SelectItem value="medium">{t("Medium")}</SelectItem>
                  <SelectItem value="high">{t("High")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t("Description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("Enter task description")}
              className="min-h-[100px] border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">{t("Due Date")}</Label>
              <Input
                id="dueDate"
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="estimatedDuration">
                {t("Estimated Duration (minutes)")}
              </Label>
              <Input
                id="estimatedDuration"
                type="number"
                value={formData.estimatedDuration || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDuration: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="120"
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">{t("Start Date")}</Label>
              <Input
                id="startDate"
                type="date"
                value={
                  formData.startDate
                    ? new Date(formData.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="endDate">{t("End Date")}</Label>
              <Input
                id="endDate"
                type="date"
                value={
                  formData.endDate
                    ? new Date(formData.endDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {task ? t("Update Task") : t("Create Task")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
