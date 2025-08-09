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
import type { Event, SendEvent } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import TimePicker from "@/components/picker-date-time/time-picker";
import { useGetAllCalendars } from "@/hooks/calendar/use.calendar";
import { useCreateEvent, useUpdateEvent } from "@/hooks/calendar/use.events";
import { DatePicker } from "../picker-date-time/date-picker";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  event?: Event | null;
  calendarID?: string | null;
}

export function EventDialog({
  calendarID,
  isOpen,
  onClose,
  onSave,
  event,
}: EventDialogProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const { createEvent, createEventError, isCreatingEvent } = useCreateEvent();
  const { updateEvent, updateEventError, isUpdatingEvent } = useUpdateEvent();
  const { data: calendarData } = useGetAllCalendars();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    event?.startTime ? new Date(event.startTime) : new Date()
  );

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
    calendarId: calendarID || "",
    minutesBefore: 2,
  });

  useEffect(() => {
    if (calendarID) {
      const selectedCalendar = calendarData?.find(
        (calendar) => calendar.id === calendarID
      );
      setFormData((prev) => ({
        ...prev,
        calendarId: calendarID,
        colorId: selectedCalendar?.colorId || "",
      }));
    }
  }, [calendarID, calendarData]);

  useEffect(() => {
    if (event) {
      setFormData((prev) => ({
        ...prev,
        ...event,
        calendarId: event.calendarId ?? prev.calendarId,
        colorId:
          calendarData?.find((calendar) => calendar.id === event.calendarId)
            ?.colorId || "",
      }));

      // Update selectedDate when editing an existing event
      if (event.startTime) {
        setSelectedDate(new Date(event.startTime));
      }
    }
  }, [event, calendarData]);

  useEffect(() => {
    if (
      !event &&
      calendarData &&
      calendarData.length > 0 &&
      !formData.calendarId
    ) {
      setFormData((prev) => ({
        ...prev,
        calendarId: calendarData[0].id,
        colorId: calendarData[0].colorId,
      }));
    }
  }, [event, calendarData, formData.calendarId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (calendarData && formData.calendarId) {
      const selectedCalendar = calendarData.find(
        (calendar) => calendar.id === formData.calendarId
      );
      if (selectedCalendar && selectedCalendar.colorId !== formData.colorId) {
        setFormData((prev) => ({
          ...prev,
          colorId: selectedCalendar.colorId,
        }));
      }
    }
  }, [calendarData, formData.calendarId, formData.colorId]);

  useEffect(() => {
    if (
      calendarData &&
      calendarData.length > 0 &&
      formData.calendarId &&
      !formData.colorId
    ) {
      const selectedCalendar = calendarData.find(
        (calendar) => calendar.id === formData.calendarId
      );
      if (selectedCalendar) {
        setFormData((prev) => ({
          ...prev,
          colorId: selectedCalendar.colorId,
        }));
      }
    }
  }, [calendarData, formData.calendarId, formData.colorId]);

  const handleSave = () => {
    if (!formData.calendarId) {
      console.error("Calendar ID is required");
      return;
    }

    if (event) {
      updateEvent(
        { data: formData as SendEvent, id: event.id },
        {
          onSuccess: () => {
            onSave(formData);
            onClose();
          },
          onError: (error) => {
            console.error("Error updating event:", error);
          },
        }
      );
    } else {
      createEvent(formData as SendEvent, {
        onSuccess: () => {
          onSave(formData);
          onClose();
        },
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
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="eventType">{t("Event Type")}</Label>
              <Select
                value={formData.calendarId || "none"}
                onValueChange={(value) => {
                  const selectedCalendar = calendarData?.find(
                    (calendar) => calendar.id === value
                  );
                  setFormData({
                    ...formData,
                    calendarId: value === "none" ? undefined : value,
                    colorId: selectedCalendar?.colorId || "",
                  });
                }}
              >
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue placeholder={t("Select event type")} />
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
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: type.colorId }}
                        />
                        {type.name}
                      </div>
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
              className="decored-selection"
            />
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
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="low"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Low")}
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Medium")}
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("High")}
                  </SelectItem>
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
                className="decored-input"
              />
            </div>
          </div>

          <TimePicker
            setFormData={setFormData}
            startDate={event?.startTime || ""}
            endDate={event?.endTime || ""}
            selectedDate={selectedDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{t("Date")}</Label>
              <DatePicker value={selectedDate} onDateChange={setSelectedDate} />
            </div>
            <div>
              <Label htmlFor="time">{t("Remind")}</Label>
              <Select
                value={formData.minutesBefore?.toString() ?? ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, minutesBefore: Number(value) })
                }
              >
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="1"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"1 " + t("minute")}
                  </SelectItem>
                  <SelectItem
                    value="5"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"5 " + t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="10"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"10 " + t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="15"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"15 " + t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="30"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"30 " + t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="60"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {"1 " + t("hour")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="repeatEvent">{t("Repeat Event")}</Label>
              <Select
                value={formData.recurrence || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, recurrence: value })
                }
              >
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="none"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("None")}
                  </SelectItem>
                  <SelectItem
                    value="daily"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Daily")}
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Weekly")}
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Monthly")}
                  </SelectItem>
                  <SelectItem
                    value="yearly"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Yearly")}
                  </SelectItem>
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
                <SelectTrigger className="w-full decored-selection">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="default"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Default")}
                  </SelectItem>
                  <SelectItem
                    value="public"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Public")}
                  </SelectItem>
                  <SelectItem
                    value="private"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-700"
                  >
                    {t("Private")}
                  </SelectItem>
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
              className="decored-input"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isCreatingEvent || isUpdatingEvent}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              disabled={isCreatingEvent || isUpdatingEvent}
            >
              {isCreatingEvent || isUpdatingEvent ? t("Saving...") : t("Save")}
            </Button>
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
