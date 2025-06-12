"use client";

import { Card, CardContent } from "@/components/ui/card";
import Check_button from "@/components/check-button";
import { Button } from "@/components/ui/button";
import {
  // Calendar,
  // Users,
  // Paperclip,
  // Bell,
  // Repeat,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import type { Event } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import "@/../i18n";

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  getPriorityColor: (priority: string) => string;
}

export function EventCard({
  event,
  onEdit,
  onDelete,
  getPriorityColor,
}: EventCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (time: string) => {
    return time;
  };

  // const formatDuration = (minutes: number) => {
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   if (hours > 0) {
  //     return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`;
  //   }
  //   return `${mins}m`;
  // };

  return (
    <Card className="dark:bg-gray-700 h-fit bg-white dark:border-slate-600 border-gray-100 hover:bg-slate-650 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div
          className={`w-10 h-3 mb-3 rounded-full ${getPriorityColor(
            event.priority
          )}`}
        />
        <div className="flex items-start justify-between mb-3 group relative">
          <div className="flex items-start justify-between relative">
            <div className="absolute mt-2.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Check_button />
            </div>
            <div className="flex-1 transform transition-transform duration-500 ease-in-out group-hover:translate-x-6">
              <h3 className="font-medium dark:text-slate-300 text-black text-sm leading-tight mb-1">
                {event.title}
              </h3>
              {event.description && (
                <p className="dark:text-slate-300 text-black text-xs mb-2 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto dark:text-slate-400 text-black dark:hover:text-white"
              >
                <Edit className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onEdit();
                  }, 0);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t("Sửa")}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onDelete} className="text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                {t("Xoá")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-black">
            <Clock className="w-3 h-3 ml-2" />
            <span>{formatDate(event.startTime)}</span>
            {" - "}
            <span>{formatTime(event.endTime)}</span>
          </div>

          {/* {event. > 0 && (
            <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-black">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(event.duration)}</span>
            </div>
          )}

          {event.participants.length > 0 && (
            <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-black">
              <Users className="w-3 h-3" />
              <span>{event.participants.length} người</span>
            </div>
          )}

          {event.attachments.length > 0 && (
            <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-black">
              <Paperclip className="w-3 h-3" />
              <span>{event.attachments.length} file</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            {event.isRecurring && (
              <Repeat className="w-3 h-3 dark:text-slate-400 text-black" />
            )}

            {event.reminders.length > 0 && (
              <Bell className="w-3 h-3 dark:text-slate-400 text-black" />
            )}
          </div> */}

          {event.description && (
            <div className="mt-2 p-2 dark:bg-slate-600 bg-gray-100 rounded text-xs text-slate-300">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 dark:bg-slate-500 bg-gray-50 rounded flex items-center justify-center">
                  <span className="text-[8px] dark:text-white text-black">
                    📝
                  </span>
                </div>
                <span className="font-medium dark:text-white text-black">
                  Ghi chú:
                </span>
              </div>
              <p className="line-clamp-2 dark:text-white text-black">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
