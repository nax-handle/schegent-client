import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
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
function toVietnamDate(dateInput: string | Date): Date {
  const date = new Date(dateInput);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const vietnamOffset = 7 * 60 * 60000;
  return new Date(utc + vietnamOffset);
}

interface PropEvent {
  eventsdata: Event[];
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  handleUpdateEvent: (event: Event) => void;
  setSelectedEvent: (event: Event | null) => void;
  handleDeleteEvent: (eventId: string) => void;
  onOptimisticUpdate?: (eventId: string, updatedEvent: Event) => void;
  currentDate: Date;
}

export default function Week({
  eventsdata,
  setSelectedEvent,
  setIsEventDialogOpen,
  handleDeleteEvent,
  onOptimisticUpdate,
  currentDate,
}: PropEvent) {
  const { updateEvent } = useUpdateEvent();
  const [events, setEvents] = useState<Event[]>(eventsdata);
  const [isDragging, setIsDragging] = useState(false);

  const today = toVietnamDate(new Date());
  const hour = today.getHours();
  const minute = today.getMinutes();
  const topOffset = hour * 56 + (minute / 60) * 56;

  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const addOpacityToHex = (color: string) => {
    const alpha = Math.round(255 * 0.19)
      .toString(16)
      .padStart(2, "0");
    return color + alpha;
  };

  const handleOptimisticUpdate = (eventId: string, updatedEvent: Event) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
    );
    if (onOptimisticUpdate) {
      onOptimisticUpdate(eventId, updatedEvent);
    }
  };

  const {
    handleMouseDownResize,
    handleMouseDownMoveBlock,
    handleMouseDownDragToOtherDay,
    dragIndicator,
  } = useEventDragResize({
    updateEvent: (params) => {
      const sendEventData: SendEvent = {
        ...params.data,
        minutesBefore: 1,
      };
      updateEvent({ id: params.id, data: sendEventData });
    },
    view: "week",
    onOptimisticUpdate: handleOptimisticUpdate,
  });

  useEffect(() => {
    setEvents(eventsdata);
  }, [eventsdata]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    event: Event
  ) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    handleMouseDownDragToOtherDay(e, event);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging]);

  return (
    <div className="w-full relative rounded-tr-xl rounded-br-xl border-gray-300 border-t-1 border-b-1 border-r-1">
      <div className="w-full flex sticky top-0 z-50 rounded-t-lg">
        <div className="grid grid-cols-7 sm:pl-20 pl-10 border-b border-gray-200 flex-1 w-full">
          {days.map((day, index) => {
            const date = new Date(currentDate);
            const diff = index - date.getDay();
            date.setDate(date.getDate() + diff);
            const zonedDate = toVietnamDate(date);
            const isToday = zonedDate.toDateString() === today.toDateString();

            return (
              <div key={day} className="py-2 text-center">
                <div className="font-medium">{day}</div>
                <div
                  className={cn(
                    "w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-full",
                    isToday
                      ? "dark:bg-white bg-[#3A82F6] text-white dark:text-black"
                      : ""
                  )}
                >
                  {zonedDate.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ContextMenuComponent
        openDialog={() => {
          setIsEventDialogOpen(true);
          setSelectedEvent(null);
        }}
      >
        <div
          className="relative overflow-y-auto scrollbar-hidden h-[calc(100vh-190px)]"
          onDoubleClick={(e) => {
            if (!(e.target as HTMLElement).closest("[data-event]")) {
              setIsEventDialogOpen(true);
              setSelectedEvent(null);
            }
          }}
        >
          <div className="absolute left-0 sm:w-20 w-10 z-10 h-full">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="flex h-14 items-center justify-center pr-2 border-r text-xs"
              >
                <p className="mb-13.5">{i === 0 ? "" : `${i}:00`}</p>
              </div>
            ))}
          </div>

          <div className="flex w-full h-full relative sm:pl-20 pl-10">
            <div className="grid grid-cols-7 divide-x divide-gray-200 flex-1 w-full">
              {days.map((day, dayIndex) => {
                const date = new Date(currentDate);
                const diff = dayIndex - date.getDay();
                date.setDate(date.getDate() + diff);
                const zonedDate = toVietnamDate(date);

                return (
                  <div key={day} className="relative">
                    {hours.map((hour, index) => (
                      <div
                        key={`${hour}-${index}`}
                        className={`h-14 ${
                          index === hours.length - 1
                            ? ""
                            : "border-b border-gray-300"
                        }`}
                      />
                    ))}

                    {events
                      .filter((event) => {
                        const eventDate = toVietnamDate(event.startTime);
                        return (
                          eventDate.getDate() === zonedDate.getDate() &&
                          eventDate.getMonth() === zonedDate.getMonth() &&
                          eventDate.getFullYear() === zonedDate.getFullYear()
                        );
                      })
                      .map((event, index) => {
                        const startTime = toVietnamDate(event.startTime);
                        const endTime = toVietnamDate(event.endTime);
                        const top =
                          startTime.getHours() * 56 +
                          (startTime.getMinutes() / 60) * 56;
                        const height =
                          (endTime.getHours() - startTime.getHours()) * 56 +
                          (endTime.getMinutes() - startTime.getMinutes()) *
                            (56 / 60);

                        return (
                          <div
                            key={index}
                            data-event="true"
                            className="absolute left-1 right-1 rounded-md p-2 overflow-hidden text-black dark:text-white border-l-4 bg-opacity-20 select-none group"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              borderLeftColor: event.colorId,
                              backgroundColor: addOpacityToHex(event.colorId),
                              zIndex: 10,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setIsEventDialogOpen(true);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="text-xs truncate pointer-events-none">
                                <p className="text-lg font-bold">
                                  {event.title}
                                </p>

                                <p className="">
                                  {startTime.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {endTime.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p className="mt-2">{event.description}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className={`border-none outline-none ${
                                      isDragging
                                        ? "hidden"
                                        : "opacity-0 group-hover:opacity-100"
                                    } transition-opacity`}
                                  >
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
                            <div
                              className={`h-full w-full ${
                                isDragging ? "cursor-grabbing" : "cursor-move"
                              }`}
                              onMouseDown={(e) => {
                                if (
                                  e.clientY -
                                    e.currentTarget.getBoundingClientRect()
                                      .top <
                                  8
                                ) {
                                  e.stopPropagation();
                                  handleMouseDownMoveBlock(e, event);
                                } else {
                                  handleMouseDown(e, event);
                                }
                              }}
                            />
                            <div
                              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-green-300"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleMouseDownResize(e, event);
                              }}
                            />
                          </div>
                        );
                      })}

                    {dayIndex === currentDate.getDay() &&
                      toVietnamDate(date).toDateString() ===
                        today.toDateString() && (
                        <div
                          className="absolute top-0 left-0 right-0 z-20"
                          style={{ top: `${topOffset}px` }}
                        >
                          <div className="relative w-full h-[1px] bg-red-500">
                            <span className="absolute -left-1 top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>
                          </div>
                        </div>
                      )}

                    {dragIndicator && dragIndicator.column === dayIndex && (
                      <div
                        className="absolute h-0.5 bg-blue-500 z-30 pointer-events-none"
                        style={{
                          top: `${dragIndicator.top}px`,
                          left: "4px",
                          right: "4px",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ContextMenuComponent>
    </div>
  );
}
