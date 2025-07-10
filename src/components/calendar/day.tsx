"use client";

import React, { useEffect, useState } from "react";
import type { Event, SendEvent } from "@/types";
import { useUpdateEvent } from "@/hooks/calendar/use.events";
import { useEventDragResize } from "@/hooks/useEventDragResize/use.event-drag-resize";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ContextMenuComponent from "../context-menu/create-event";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface PropEvent {
  eventsData: Event[];
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  handleUpdateEvent: (event: Event) => void;
  handleDeleteEvent: (eventId: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  onOptimisticUpdate?: (eventId: string, updatedEvent: Event) => void;
  currentDate: Date;
}

export default function Day({
  eventsData,
  setSelectedEvent,
  setIsEventDialogOpen,
  handleDeleteEvent,
  onOptimisticUpdate,
  currentDate,
}: PropEvent) {
  const [topOffset, setTopOffset] = useState(0);
  const { updateEvent } = useUpdateEvent();
  const [isDragging, setIsDragging] = useState(false);
  const [originalEvents, setOriginalEvents] = useState<Map<string, Event>>(
    new Map()
  );
  const [events, setEvents] = useState<Event[]>(eventsData);
  const { t, i18n } = useTranslation();
  const handleOptimisticUpdate = (eventId: string, updatedEvent: Event) => {
    const originalEvent = events.find((e) => e.id === eventId);
    if (originalEvent) {
      setOriginalEvents((prev) => new Map(prev.set(eventId, originalEvent)));
    }

    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
    );

    if (onOptimisticUpdate) {
      onOptimisticUpdate(eventId, updatedEvent);
    }
  };

  const { handleMouseDownResize, handleMouseDownMoveBlock } =
    useEventDragResize({
      updateEvent: (params) => {
        handleOptimisticUpdate(params.id, params.data as Event);
        const sendEventData: SendEvent = {
          ...params.data,
          minutesBefore: 1,
        };
        updateEvent(
          { id: params.id, data: sendEventData },
          {
            onError: () => {
              const originalEvent = originalEvents.get(params.id);
              if (originalEvent) {
                setEvents((prevEvents) =>
                  prevEvents.map((event) =>
                    event.id === params.id ? originalEvent : event
                  )
                );
                setOriginalEvents((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(params.id);
                  return newMap;
                });
              }
            },
          }
        );
      },
      view: "day",
      onOptimisticUpdate: handleOptimisticUpdate,
    });

  const daysVi = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const daysEn = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const lang = i18n?.language || i18next.language || "en";
  const daysVN = lang.startsWith("vi") ? daysVi : daysEn;
  const date = currentDate;
  const weekday = daysVN[date.getDay()];
  const displayDate = date.getDate();

  const calculateTopOffset = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const offset = hours * 65 + minutes * (65 / 60);
    setTopOffset(offset);
  };

  useEffect(() => {
    calculateTopOffset();
    const interval = setInterval(calculateTopOffset, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  const addOpacityToHex = (color: string) => {
    const alpha = Math.round(255 * 0.19)
      .toString(16)
      .padStart(2, "0");
    return color + alpha;
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLSpanElement>,
    event: Event
  ) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    setIsDragging(true);
    handleMouseDownMoveBlock(e, event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full inset-0 bg-gray/30 backdrop-blur-xl overflow-hidden border-gray-300 border-t-1 border-r-1 border-b-1 rounded-tr-xl rounded-br-xl">
      <p className="p-2 pl-6 text-2xl dark:text-white w-fit rounded-full">
        {weekday}, {displayDate}
      </p>
      <div className="h-full w-full">
        <div className="mx-2 flex">
          <span className="text-sm dark:text-white border-b border-r w-[85px] px-4">
            GMT+00
          </span>
          <span className="text-sm text-white border-b p-2 w-full"></span>
        </div>
        <ContextMenuComponent
          openDialog={() => {
            setIsEventDialogOpen(true);
            setSelectedEvent(null);
          }}
        >
          <div
            className="mx-2 flex overflow-y-scroll relative overflow-x-hidden scrollbar-hidden h-[calc(100vh-250px)] sm:h-[calc(100vh-185px)]"
            onDoubleClick={(e) => {
              if (!(e.target as HTMLElement).closest("[data-event]")) {
                setIsEventDialogOpen(true);
                setSelectedEvent(null);
              }
            }}
          >
            <div className="flex h-full w-full">
              <div className="w-full relative">
                <div className="absolute -top-[10px] left-0 z-10">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div className="flex h-[65px]" key={i}>
                      <div className="w-[85px] z-20 border-r">
                        <p className="text-sm dark:text-white text-black w-18 px-4">
                          {i === 0 ? "" : `${i}:00`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {Array.from({ length: 24 }, (_, j) => (
                  <div
                    key={j}
                    className={`absolute ${j > 0 && "border-b"} w-full left-18`}
                    style={{ top: `${j * 65}px` }}
                  ></div>
                ))}

                {events
                  .filter((event) => {
                    const eventDate = new Date(event.startTime);
                    return (
                      eventDate.getDate() === currentDate.getDate() &&
                      eventDate.getMonth() === currentDate.getMonth() &&
                      eventDate.getFullYear() === currentDate.getFullYear()
                    );
                  })
                  .map((event) => {
                    const stateTime = new Date(event.startTime);
                    const hourStartTime = stateTime.getHours();
                    const minuteStartTime = stateTime.getMinutes();
                    const top =
                      hourStartTime * 65 + (minuteStartTime / 60) * 65;

                    const endTime = new Date(event.endTime);
                    const hourEndTime = endTime.getHours();
                    const minuteEndTime = endTime.getMinutes();
                    const height =
                      (hourEndTime - hourStartTime) * 65 +
                      (minuteEndTime - minuteStartTime) * (65 / 60);

                    const formatTime = (date: Date) => {
                      return date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });
                    };

                    return (
                      <div
                        key={event.id}
                        className="flex items-center w-full left-26 z-20 justify-right absolute right-0"
                        style={{ top: `${top}px` }}
                      >
                        <span
                          data-event="true"
                          onMouseDown={(e) => handleMouseDown(e, event)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setIsEventDialogOpen(true);
                          }}
                          className={`p-3 w-full mr-30 border-l-4 bg-opacity-20 rounded-md text-black dark:text-white flex flex-col relative ${
                            isDragging ? "cursor-grabbing" : "cursor-move"
                          } group`}
                          style={{
                            height: `${height}px`,
                            borderLeftColor: event.colorId,
                            backgroundColor: addOpacityToHex(event.colorId),
                            overflow: "hidden",
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xl font-semibold dark:text-white">
                              {event.title}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="border-none outline-none">
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />{" "}
                                  {t("Update")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="text-red-600 focus:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />{" "}
                                  {t("Delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <span className="spanText-event">
                            {formatTime(stateTime)} - {formatTime(endTime)}
                          </span>
                          <span className="spanText-event">
                            <span className="font-bold">
                              {t("Description")}:
                            </span>{" "}
                            {event.description}
                          </span>
                          <span className="spanText-event">
                            <span className="font-bold">{t("Location")}:</span>{" "}
                            {event.location}
                          </span>

                          {/* Resize Bottom */}
                          <div
                            className="resize-handle absolute bottom-0 left-0 w-full h-0.5 cursor-ns-resize z-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                            onMouseDown={(e) => handleMouseDownResize(e, event)}
                          ></div>
                        </span>
                      </div>
                    );
                  })}

                {/* Dòng giờ hiện tại */}
                <div
                  className="flex items-center w-full z-20 justify-right absolute right-0 left-19.5"
                  style={{ top: `${topOffset}px` }}
                >
                  <span className="bg-red-500 h-[1px] w-full flex items-center">
                    <span className="w-3 h-3 rounded-full p-1 bg-red-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ContextMenuComponent>
      </div>
    </div>
  );
}
