import React from "react";
import { cn } from "@/lib/utils";
import { HomeProps } from "../interface";

export default function Week({ events }: HomeProps) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const todayIndex = now.getDay(); // 0 (Sun) -> 6 (Sat)

  const topOffset = hour * 56 + (minute / 60) * 56;

  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full h-[115vh] relative">
      <div className="w-full flex sticky  top-0 bg-white z-40">
        <div className="grid grid-cols-7 pl-19 border-b border-gray-200 flex-1 w-full ">
          {days.map((day, index) => {
            const date = new Date(2025, 4, 4 + index);
            const isToday = index === todayIndex;
            return (
              <div key={day} className="py-2 text-center">
                <div className="font-medium">{day}</div>
                <div
                  className={cn(
                    "w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-full",
                    isToday ? "bg-black text-white" : ""
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-18 left-0 w-20 z-10 bg-white">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="flex h-14 items-center justify-center pr-2 border-r text-xs text-gray-600"
          >
            <p className="mb-13.5">{i === 0 ? "" : `${i}:00`}</p>
          </div>
        ))}
      </div>

      <div className="flex w-full h-full relative pl-20 ">
        <div className="grid grid-cols-7 divide-x divide-gray-200 flex-1  w-full">
          {days.map((day, dayIndex) => (
            <div key={day} className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-14 border-b border-r border-gray-100"
                ></div>
              ))}

              {events
                .filter((event) => {
                  return (
                    event.date === dayIndex + 4 ||
                    (dayIndex === 4 && event.date === 8)
                  );
                })
                .map((event, idx) => {
                  const top = event.startHour * 56;
                  const height = event.duration * 56;

                  return (
                    <div
                      key={idx}
                      className="absolute left-1 right-1 bg-green-500 text-white rounded-sm p-1 overflow-hidden"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="text-xs font-medium truncate">
                        {event.time}
                      </div>
                      <div className="text-xs truncate">{event.title}</div>
                    </div>
                  );
                })}

              {dayIndex === todayIndex && (
                <div
                  className="flex items-center w-full z-20 justify-right absolute left-0 "
                  style={{ top: `${topOffset}px` }}
                >
                  <span className="bg-red-500 h-[0.5px] w-full flex items-center">
                    <span className="w-1 h-1 rounded-full mb-0 p-1 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
