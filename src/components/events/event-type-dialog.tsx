"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventType } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";

interface EventTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventType: Partial<EventType>) => void;
  eventType?: EventType | null;
}

const colorOptions = [
  { name: "Xanh dương", value: "bg-blue-500" },
  { name: "Xanh lá", value: "bg-green-500" },
  { name: "Tím", value: "bg-purple-500" },
  { name: "Cam", value: "bg-orange-500" },
  { name: "Đỏ", value: "bg-red-500" },
  { name: "Vàng", value: "bg-yellow-500" },
  { name: "Hồng", value: "bg-pink-500" },
  { name: "Xám", value: "bg-gray-500" },
];

export function EventTypeDialog({
  isOpen,
  onClose,
  onSave,
  eventType,
}: EventTypeDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<EventType>>({
    name: "",
    color: "bg-blue-500",
  });

  useEffect(() => {
    if (eventType) {
      setFormData(eventType);
    } else {
      setFormData({
        name: "",
        color: "bg-blue-500",
      });
    }
  }, [eventType]);

  const handleSave = () => {
    if (formData.name?.trim()) {
      onSave(formData);
      onClose();
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
                setFormData({ ...formData, name: e.target.value })
              }
              className="my-3 rounded-sm focus-visible:ring-blue-500  dark:selection:bg-[#658DBD] selection:bg-blue-500 selection:text-white"
              placeholder={t("Enter event type name")}
            />
          </div>

          <div>
            <Label>{t("Color")}</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-white shadow-lg scale-105"
                      : "border-gray-300 hover:border-gray-400"
                  } ${color.value}`}
                  onClick={() =>
                    setFormData({ ...formData, color: color.value })
                  }
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              variant={"decorate"}
              onClick={handleSave}
              className="w-fit rounded-sm"
              disabled={!formData.name?.trim()}
            >
              {eventType ? t("Update") : "Create Event Type"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
