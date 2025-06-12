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
import type { Event, Calendar, SendEvent } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import TimePicker from "@/components/picker-date-time/time-picker";
import { Switch } from "../ui/switch";
import ColorPicker from "../ui/color-picker";
import { useCreateEvent, useUpdateEvent } from "@/hooks/calendar/use.events";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  event?: Event | null;
  eventTypes: Calendar[];
  calendarID?: string | null;
}

export function EventDialog({
  calendarID,
  isOpen,
  onClose,
  onSave,
  event,
  eventTypes,
}: EventDialogProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const { createEvent, createEventError } = useCreateEvent();
  const { updateEvent, updateEventError } = useUpdateEvent();

  const [formData, setFormData] = useState<Partial<SendEvent>>({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    hangoutLink: "",
    recurrence: "",
    icon: "",
    visibility: "default",
    status: "confirmed",
    priority: "medium",
    eventCategory: "general",
    colorId: "",
    isAllDay: false,
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
    if (event) {
      setFormData((prev) => ({
        ...prev,
        ...event,
        calendarId: event.calendarId ?? prev.calendarId,
      }));
    }
  }, [event]);

  const handleSave = () => {
    if (!formData.calendarId && calendarID) {
      formData.calendarId = calendarID;
    }

    onSave(formData);
    onClose();

    if (event) {
      updateEvent(
        { data: formData as SendEvent, id: event.id },
        {
          onSuccess: () => onClose(),
          onError: (error) => {
            console.error("Error updating event:", error);
          },
        }
      );
    } else {
      createEvent(formData as SendEvent, {
        onSuccess: () => onClose(),
        onError: (error) => {
          console.error("Error creating event:", error);
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
          {event ? t("Edit Event") : t("Add Event")}
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
                placeholder={t("Enter event title")}
              />
            </div>

            <div>
              <Label htmlFor="eventType">{t("Event Type")}</Label>
              <Select
                value={formData.calendarId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, calendarId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select Event Type")} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
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
              placeholder={t("Enter event description")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Label htmlFor="isAllDay">{t("All Day Event:")}</Label>
              <Switch
                id="isAllDay"
                checked={formData.isAllDay || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAllDay: checked })
                }
                className="ml-2"
              />
            </div>
            <div className="flex items-center">
              <Label className="mr-3" htmlFor="colorId">
                {t("Color")}:
              </Label>
              <ColorPicker
                id="colorId"
                value={formData.colorId || "#ffffff"}
                onChange={(colorId: string) =>
                  setFormData({ ...formData, colorId })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prioritylevel">{t("Priority Level")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    priority: value as "low" | "medium" | "high",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("Low")}</SelectItem>
                  <SelectItem value="medium">{t("Medium")}</SelectItem>
                  <SelectItem value="high">{t("High")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hangoutLink">{t("Hangout Link")}</Label>
              <Input
                id="hangoutLink"
                value={formData.hangoutLink || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hangoutLink: e.target.value })
                }
                placeholder={t("Enter event hangout link")}
              />
            </div>
          </div>

          <TimePicker setFormData={setFormData} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="repeatEvent">{t("Repeat Event")}</Label>
              <Select
                value={formData.recurrence || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, recurrence: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("None")}</SelectItem>
                  <SelectItem value="daily">{t("Daily")}</SelectItem>
                  <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("Yearly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("Visibility")}</Label>
              <Select
                value={formData.visibility || "default"}
                onValueChange={(value) =>
                  setFormData({ ...formData, visibility: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("Default")}</SelectItem>
                  <SelectItem value="public">{t("Public")}</SelectItem>
                  <SelectItem value="private">{t("Private")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">{t("Location")}</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder={t("Enter event location")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t("Status")}</Label>
              <Select
                value={formData.status || "confirmed"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "confirmed" | "tentative" | "cancelled",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">{t("Confirmed")}</SelectItem>
                  <SelectItem value="tentative">{t("Tentative")}</SelectItem>
                  <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="eventCategory">{t("Event Category")}</Label>
              <Select
                value={formData.eventCategory || "general"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    eventCategory: value as "general" | "habit" | "task",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t("General")}</SelectItem>
                  <SelectItem value="habit">{t("Habit")}</SelectItem>
                  <SelectItem value="task">{t("Task")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSave}>{t("Save")}</Button>
            {(createEventError || updateEventError) && (
              <span className="ml-2 text-sm text-red-500">
                {createEventError?.message ||
                  updateEventError?.message ||
                  t("An error occurred")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
