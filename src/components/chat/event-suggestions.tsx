"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Check, X } from "lucide-react";
import type { Events } from "@/lib/services/chatbot";

interface EventSuggestionsProps {
  events: Events[];
  onAcceptEvent: (event: Events, index: number) => void;
  onRejectEvent: (index: number) => void;
  onAcceptAll: (events: Events[]) => void;
  onRejectAll: () => void;
  isLoading?: boolean;
  acceptedEvents?: number[];
  rejectedEvents?: number[];
}

export default function EventSuggestions({
  events,
  onAcceptEvent,
  onRejectEvent,
  onAcceptAll,
  onRejectAll,
  isLoading = false,
  acceptedEvents = [],
  rejectedEvents = [],
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
            Một vài thay đổi
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {events.map((event, index) => {
            const startTime = formatDateTime(event.startTime);
            const endTime = formatDateTime(event.endTime);
            const isAccepted = acceptedEvents.includes(index);
            const isRejected = rejectedEvents.includes(index);

            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-lg border p-3 ${
                  isAccepted
                    ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                    : isRejected
                    ? "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/20"
                    : "border-blue-200 dark:border-blue-700"
                }`}
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

                  <div className="flex items-center gap-2 ml-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.colorId || "#3B82F6" }}
                    />

                    {!isAccepted && !isRejected && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 border-red-300 hover:border-red-500 hover:bg-red-50"
                          onClick={() => onRejectEvent(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                          onClick={() => onAcceptEvent(event, index)}
                          disabled={isLoading}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </Button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" />
                        <span className="text-xs">Đã chấp nhận</span>
                      </div>
                    )}

                    {isRejected && (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" />
                        <span className="text-xs">Đã từ chối</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-end mx-auto w-fit">
          <Button
            variant="outline"
            size="sm"
            onClick={onRejectAll}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800 border-gray-300"
          >
            <X className="h-3 w-3 mr-1" />
            Từ chối
          </Button>
          <Button
            size="sm"
            onClick={() => onAcceptAll(events)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="h-3 w-3 mr-1" />
            {isLoading ? "Đợi chút nhé" : "Xác nhận"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
