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
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import type { Event, Calendar } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import TimePicker from "@/components/picker-date-time/time-picker";
import DatePickerWithRange from "../picker-date-time/date-picker-with-range";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  event?: Event | null;
  eventTypes: Calendar[];
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  event,
  eventTypes,
}: EventDialogProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    eventTypeId: null,
    priority: "medium",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    duration: 0,
    participants: [],
    attachments: [],
    notes: "",
    isRecurring: false,
    recurringType: undefined,
    reminders: [],
    status: "pending",
  });

  const [newParticipant, setNewParticipant] = useState("");
  const [newReminder, setNewReminder] = useState("");

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleSave = () => {
    if (newReminder) {
      formData.reminders = [
        ...(formData.reminders || []),
        typeof newReminder === "string" ? parseInt(newReminder) : newReminder,
      ];
    }
    onSave(formData);
    onClose();
  };

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setFormData({
        ...formData,
        participants: [...(formData.participants || []), newParticipant.trim()],
      });
      setNewParticipant("");
    }
  };

  const removeParticipant = (index: number) => {
    setFormData({
      ...formData,
      participants: formData.participants?.filter((_, i) => i !== index) || [],
    });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.endsWith("@")) {
      val += "gmail.com";
    }
    setNewParticipant(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map((file) => file.name);
    setFormData({
      ...formData,
      attachments: [...(formData.attachments || []), ...fileNames],
    });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter((_, i) => i !== index) || [],
    });
  };

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       onClose();
  //     }
  //   }
  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

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
                className="focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
              />
            </div>
            <div>
              <Label htmlFor="eventType">{t("Event Type")}</Label>
              <Select
                value={formData.eventTypeId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    eventTypeId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger className="w-full  focus:ring-blue-500 hover:border-blue-600">
                  <SelectValue placeholder={t("Select event type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("Work to be done")}</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.colorId} value={type.colorId}>
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
              className="focus:ring-blue-500 hover:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Priority Level")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="w-full focus:ring-blue-500 hover:border-blue-600">
                  <SelectValue className="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="low"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Low")}
                  </SelectItem>

                  <SelectItem
                    value="medium"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Medium")}
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("High")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("Date")}</Label>
              <DatePickerWithRange />
            </div>
          </div>

          <TimePicker />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Repeat Event")}</Label>
              <Select
                value={formData.recurringType}
                onValueChange={(value: string | undefined) =>
                  setFormData({
                    ...formData,
                    recurringType: value as
                      | "daily"
                      | "weekly"
                      | "monthly"
                      | undefined,
                  })
                }
              >
                <SelectTrigger className="w-full focus:ring-blue-500 hover:border-blue-600">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Not"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Not")}
                  </SelectItem>
                  <SelectItem
                    value="daily"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Daily")}
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Weekly")}
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    {t("Monthly")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("Early reminder")}</Label>
              <Select
                value={newReminder}
                onValueChange={(value) => setNewReminder(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="5m"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    5 {t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="15m"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    15 {t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="30m"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    30 {t("minutes")}
                  </SelectItem>
                  <SelectItem
                    value="1h"
                    className="data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600"
                  >
                    1 {t("hours")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("Participant")}</Label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={newParticipant}
                onChange={handleChangeEmail}
                placeholder={t("Enter participant email")}
                onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                className="focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addParticipant}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.participants?.map((p, index) => (
                <Badge
                  key={index}
                  className="flex items-center gap-1 cursor-pointer bg-blue-500"
                  onClick={() => removeParticipant(index)}
                >
                  {p}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>{t("File Attachments")}</Label>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.attachments?.map((file, index) => (
                <Badge
                  key={index}
                  className="flex items-center gap-1 cursor-pointer bg-blue-500"
                  onClick={() => removeAttachment(index)}
                >
                  <Upload className="w-3 h-3" />
                  {file}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              variant="decorate"
              className="w-fit rounded-sm px-10"
              onClick={handleSave}
            >
              {t("Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
