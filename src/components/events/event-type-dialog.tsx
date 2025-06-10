"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SendCalendar, Calendar } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { Switch } from "@/components/ui/switch";
import ColorPicker from "@/components/ui/color-picker";
import {
  useCreateCalendar,
  useUpdateCalendar,
} from "@/hooks/calendar/use.calendar";
import { useEffect, useState } from "react";

interface EventTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventType?: Calendar | null;
  handleCreateEventType?: (data: SendCalendar) => void;
  handleUpdateEventType?: (data: SendCalendar, id: string) => void;
}

export function EventTypeDialog({
  isOpen,
  onClose,
  eventType,
  handleCreateEventType,
  handleUpdateEventType,
}: EventTypeDialogProps) {
  const { t } = useTranslation();
  const { createCalendar, isCreatingCalendar, createCalendarError } =
    useCreateCalendar();

  const { updateCalendar, isUpdatingCalendar, updateCalendarError } =
    useUpdateCalendar();

  const [formData, setFormData] = useState<SendCalendar>({
    name: "",
    description: "",
    isPrimary: false,
    isShared: false,
    colorId: "",
  });

  useEffect(() => {
    if (eventType) {
      setFormData(eventType);
    } else {
      setFormData({
        name: "",
        description: "",
        isPrimary: false,
        isShared: false,
        colorId: "",
      });
    }
  }, [eventType, isOpen]);

  const handleCreateSubmit = () => {
    createCalendar(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Create calendar failed", error);
      },
    });
    if (handleCreateEventType) {
      handleCreateEventType(formData);
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    if (!eventType) return;
    e.preventDefault();
    updateCalendar(
      { data: formData, id: eventType.id },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error: unknown) => {
          console.error("Update calendar failed", error);
        },
      }
    );
    if (handleUpdateEventType) {
      handleUpdateEventType(formData, eventType.id);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {eventType ? t("Edit Event Type") : t("Create Event Type")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("Event Type Name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="my-3 rounded-sm focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
              placeholder={t("Enter event type name")}
            />
          </div>
          <div>
            <Label htmlFor="description">{t("Description")}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="my-3 rounded-sm focus-visible:ring-blue-500 dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
              placeholder={t("Enter description")}
            />
          </div>
          <div className="flex justify-between px-2 gap-4">
            <div className="flex items-center">
              <Label htmlFor="isPrimary">{t("isPrimary")}</Label>
              <Switch
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPrimary: checked }))
                }
                className="ml-2"
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="isShared">{t("isShared")}</Label>
              <Switch
                id="isShared"
                checked={formData.isShared}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isShared: checked }))
                }
                className="ml-2"
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="colorId">{t("Color")}</Label>
              <ColorPicker
                className="ml-2"
                value={formData.colorId || "#ffffff"}
                onChange={(colorId: string) =>
                  setFormData((prev) => ({ ...prev, colorId }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              variant={"decorate"}
              onClick={eventType ? handleUpdateSubmit : handleCreateSubmit}
              className="w-fit rounded-sm"
              disabled={eventType ? isUpdatingCalendar : isCreatingCalendar}
            >
              {eventType ? t("Update") : t("Create Event Type")}
            </Button>
          </div>
          {createCalendarError && (
            <p className="text-sm text-red-500">
              {String(createCalendarError)}
            </p>
          )}
          {updateCalendarError && (
            <p className="text-sm text-red-500">
              {String(updateCalendarError)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
