"use client";

import React, { useEffect, useState } from "react";
import type { Event } from "@/types";
import { useUpdateEvent } from "@/hooks/calendar/use.events";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEventDragResize } from "@/hooks/useEventDragResize/useEventDragResize";

export default function Day({ eventsdata }: { eventsdata: Event[] }) {
  const [topOffset, setTopOffset] = useState(0);
  const { updateEvent } = useUpdateEvent();
  const { handleMouseDownResize, handleMouseDownMoveBlock } =
    useEventDragResize({ updateEvent });

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

  const addOpacityToHex = (color: string) => {
    const alpha = Math.round(255 * 0.19)
      .toString(16)
      .padStart(2, "0");
    return color + alpha;
  };

  const handleDeleteEventType = (id: string) => {
    console.log("Delete event with id:", id);
  };

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
          style={{ height: "calc(100vh - 245px)" }}
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

              {eventsdata
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

                  return (
                    <div
                      key={event.id}
                      className="flex items-center sm:w-[94.5%] w-[73%] left-26 z-20 justify-right absolute right-0"
                      style={{ top: `${top}px` }}
                    >
                      <span
                        onMouseDown={(e) => handleMouseDownMoveBlock(e, event)}
                        className={`px-3 pt-2 pb-4 border-l-4 w-[98%] bg-opacity-20 rounded-md text-black dark:text-white flex flex-col relative cursor-move`}
                        style={{
                          height: `${height}px`,
                          borderLeftColor: event.colorId,
                          backgroundColor: addOpacityToHex(event.colorId),
                        }}
                      >
                        {/* Menu */}
                        <div className="absolute top-1 right-1 z-50">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 dark:hover:text-white hover:text-black p-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Event</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteEventType(event.id)}
                                className="text-red-400"
                              >
                                Delete Event
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const newEndTime = new Date(event.endTime);
                                  newEndTime.setMinutes(
                                    newEndTime.getMinutes() + 5
                                  );
                                  updateEvent({
                                    id: event.id,
                                    data: {
                                      ...event,
                                      endTime: newEndTime.toISOString(),
                                    },
                                  });
                                }}
                              >
                                +5 minutes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <span className="text-xs font-semibold dark:text-white">
                          {event.title}
                        </span>
                        <span className="text-xs dark:text-white">
                          {event.description}
                        </span>

                        {/* Resize Bottom */}
                        <div
                          className="resize-handle absolute bottom-0 left-0 w-full h-2 cursor-ns-resize z-50 hover:bg-gray-300 dark:hover:bg-gray-600"
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
