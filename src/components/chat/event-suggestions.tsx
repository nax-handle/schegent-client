"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Check, X } from "lucide-react";
import type { SuggestedEvent } from "@/lib/services/chatbot";

interface EventSuggestionsProps {
  events: SuggestedEvent[];
  onAccept: (events: SuggestedEvent[]) => void;
  onReject: () => void;
  isLoading?: boolean;
}

export default function EventSuggestions({
  events,
  onAccept,
  onReject,
  isLoading = false,
}: EventSuggestionsProps) {
  if (!events.length) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 mb-3">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Tôi tìm thấy {events.length} sự kiện có thể thêm vào lịch của bạn:
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {events.map((event, index) => {
            const startTime = formatDateTime(event.startTime);
            const endTime = formatDateTime(event.endTime);

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {startTime.date} • {startTime.time} - {endTime.time}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full ml-3 mt-1 flex-shrink-0"
                    style={{ backgroundColor: event.colorId }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 border-gray-300"
          >
            <X className="h-3 w-3 mr-1" />
            Từ chối
          </Button>
          <Button
            size="sm"
            onClick={() => onAccept(events)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="h-3 w-3 mr-1" />
            {isLoading ? "Đang thêm..." : "Thêm vào lịch"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
