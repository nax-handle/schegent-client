"use client";

import React, { useEffect, useState } from "react";
import type { Event } from "@/types";
import { useUpdateEvent } from "@/hooks/calendar/use.events";
import { useEventDragResize } from "@/hooks/useEventDragResize/use.event-drag-resize";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PropEvent {
  eventsdata: Event[];
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  handleUpdateEvent: (event: Event) => void;
  handleDeleteEvent: (eventId: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  onOptimisticUpdate?: (eventId: string, updatedEvent: Event) => void;
}

export default function Day({
  eventsdata,
  setSelectedEvent,
  setIsEventDialogOpen,
  handleDeleteEvent,
  onOptimisticUpdate,
}: PropEvent) {
  const [topOffset, setTopOffset] = useState(0);
  const { updateEvent } = useUpdateEvent();
  const [isDragging, setIsDragging] = useState(false);
  const { handleMouseDownResize, handleMouseDownMoveBlock } =
    useEventDragResize({
      updateEvent,
      view: "day",
      onOptimisticUpdate,
    });
  const [events, setEvents] = useState<Event[]>(eventsdata);

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const todayDate = today.getDate();
  const daysVN = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const weekday = daysVN[date.getDay()];

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
    setEvents(eventsdata);
  }, [eventsdata]);

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
    <div className="w-full inset-0 bg-gray/30 backdrop-blur-xl black overflow-hidden border-gray-300 border-t-1 border-r-1 border-b-1 rounded-tr-xl rounded-br-xl">
      <p className="p-2 pl-6 text-2xl dark:text-white w-fit rounded-full">
        {weekday}, {todayDate}
      </p>
      <div className="h-full w-full">
        <div className="mx-2 flex">
          <span className="text-sm dark:text-white border-b border-r w-[85px] px-4">
            GMT+00
          </span>
          <span className="text-sm text-white border-b p-2 w-full"></span>
        </div>
        <div
          className="mx-2 flex overflow-y-scroll relative overflow-x-hidden scrollbar-hidden"
          style={{ height: "calc(100vh - 225px)" }}
          onDoubleClick={() => {
            setIsEventDialogOpen(true);
            setSelectedEvent(null);
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
                .filter(
                  (event) =>
                    new Date(event.startTime).getDate() === new Date().getDate()
                )
                .map((event) => {
                  const stateTime = new Date(event.startTime);
                  const hourStartTime = stateTime.getHours();
                  const minuteStartTime = stateTime.getMinutes();
                  const top = hourStartTime * 65 + (minuteStartTime / 60) * 65;

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
                        onMouseDown={(e) => handleMouseDown(e, event)}
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
                                <Pencil className="w-4 h-4 mr-2" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 focus:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <span className="spanText-event">
                          {formatTime(stateTime)} - {formatTime(endTime)}
                        </span>
                        <span className="spanText-event">
                          <span className="font-bold">Description:</span>{" "}
                          {event.description}
                        </span>
                        <span className="spanText-event">
                          <span className="font-bold">Location:</span>{" "}
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
      </div>
    </div>
  );
}
